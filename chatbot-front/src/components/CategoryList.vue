<template>
  <!-- eslint-disable  vue/no-v-model-argument -->
  <div>
    <n-list hoverable clickable>
      <n-list-item v-for="category in filteredCategories" :key="category.name">
        <template #suffix>
          <n-dropdown trigger="hover" :options="categoryOptions" @select="(key) => handleSelect(key, category)">
            <n-button>
              <template #icon>
                <n-icon :component="EllipsisVerticalIcon" />
              </template>
            </n-button>
          </n-dropdown>
        </template>
        <n-thing :title="category.name" content-style="margin-top: 10px;" @click="openCategory(category)">
          <template #description>
            <n-space v-if="category.favorite" size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="warning" size="small">
                Favorito
                <template #icon>
                  <n-icon :component="StarIcon" />
                </template>
              </n-tag>
            </n-space>
          </template>
          {{ category.description }}
        </n-thing>
      </n-list-item>
    </n-list>
    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      type="error"
      title="Apagar categoria"
      :content="`Você realmente deseja apagar a categoria: '${currentCategory.name}'?`"
      positive-text="Apagar"
      negative-text="Cancelar"
      @positive-click="deleteCategory"
    />
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        :title="currentCategory.name"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="editCategoryFormRef"
          :model="categoryForm"
          :rules="categoryFormRules"
          style="margin: auto; max-width: 600px;"
        >
          <n-form-item label="Nome da categoria" path="name">
            <n-input v-model:value="categoryForm.name" placeholder="Nome da categoria" />
          </n-form-item>
          <n-form-item label="Descrição" path="description">
            <n-input
              v-model:value="categoryForm.description" placeholder="Descrição" type="textarea"
              :autosize="{
                minRows: 3
              }"
            />
          </n-form-item>
          <n-button type="primary" block @click="submitEditCategory">
            Salvar
          </n-button>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import axios from 'axios';
import {
  Star as StarIcon,
  EllipsisVerticalOutline as EllipsisVerticalIcon,
  Trash as TrashIcon,
  DocumentText as DocumentTextIcon,
} from '@vicons/ionicons5';
import { useLoadingBar, useMessage, NIcon } from 'naive-ui';
import { h, ref } from 'vue';
import { useGlobalStore } from '../store/GlobalStore';
import { useUserStore } from '../store/UserStore';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  components: {
  },
  props: {
    type: {
      type: String,
      default: 'all',
    },
  },
  setup() {
    const userStore = useUserStore();
    const editCategoryFormRef = ref(null);
    const model = ref({
      name: '',
      description: '',
    });

    return {
      StarIcon,
      EllipsisVerticalIcon,
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      message: useMessage(),
      editCategoryFormRef,
      categoryForm: model,
      categoryFormRules: {
        name: {
          required: true,
          message: 'Insira o nome da categoria',
          trigger: 'blur',
        },
        description: {
          required: false,
          trigger: 'blur',
        },
      },
      categoryOptions: [
        {
          label: 'Apagar',
          key: 'delete',
          icon: renderIcon(TrashIcon),
          disabled: !userStore.profile.isadmin,
        },
        {
          label: 'Editar',
          key: 'edit',
          icon: renderIcon(DocumentTextIcon),
          disabled: !userStore.profile.isadmin,
        },
        {
          label: 'Favorito',
          key: 'favorite',
          icon: renderIcon(StarIcon),
        },
      ],
    };
  },
  data() {
    return {
      categories: [],
      currentCategory: {},
      showDeleteModal: false,
      showEditModal: false,
    };
  },
  computed: {
    filteredCategories() {
      if (!this.globalStore.data?.categories) {
        return [];
      }
      return this.globalStore.data.categories.filter(category => {
        if (this.type === 'favorites') return category.favorite === true;
        return true;
      });
    },
  },
  mounted() {
    this.$emitter.on('refreshCategories', this.updateCategories);
    if (!this.globalStore.data.categories?.length) {
      this.updateCategories();
    }
  },
  unmounted() {
    this.$emitter.off('refreshCategories', this.updateCategories);
  },
  methods: {
    openCategory(category) {
      this.globalStore.setCurrentCategory(category);
      this.$router.push(`/category/${category.id}`);
    },
    handleSelect(key, category) {
      this.currentCategory = category;
      if (key === 'edit') {
        this.showEditModal = true;
        this.categoryForm.name = category.name;
        this.categoryForm.description = category.description;
      }
      if (key === 'delete') {
        this.showDeleteModal = true;
      }
      if (key === 'favorite') {
        if (category.favorite) {
          const apiUrl = this.globalStore.apiUrl;
          axios.delete(`${apiUrl}/category/favorite/${category.id}`)
            .then(res => {
              this.message.success('Categoria definida como favorita');
            }).catch(err => {
              this.message.error('Ocorreu um erro ao adicionar uma categoria como favorita');
            }).finally(() => {
              this.updateCategories();
            });
        } else {
          const apiUrl = this.globalStore.apiUrl;
          axios.post(`${apiUrl}/category/favorite/${category.id}`)
            .then(res => {
              this.message.success('Categoria definida como favorita');
            }).catch(err => {
              this.message.error('Ocorreu um erro ao adicionar uma categoria como favorita');
            }).finally(() => {
              this.updateCategories();
            });
        }
      }
    },
    updateCategories() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/category`)
        .then(res => {
          this.categories = res.data;
          this.globalStore.data.categories = this.categories;
          this.loadingBar.finish();
          this.message.success('Lista de categorias atualizada');
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
          this.message.error('Erro ao tentar atualizar a lista de categorias');
        });
    },
    deleteCategory() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.delete(`${apiUrl}/category/${this.currentCategory.id}`)
        .then(res => {
          this.message.success(`Categoria ${this.currentCategory.name} apagada com sucesso`);
          this.loadingBar.finish();
        }).catch(err => {
          this.message.error(`Erro ao tentar apagar a categoria ${this.currentCategory.name}`);
          console.error(err);
          this.loadingBar.error();
        }).finally(() => {
          this.updateCategories();
        });
    },
    submitEditCategory() {
      this.editCategoryFormRef.validate(
        errors => {
          if (!errors) {
            const API_URL = this.globalStore.apiUrl;
            this.loadingBar.start();
            axios.patch(`${API_URL}/category/${this.currentCategory.id}`, {
              name: this.editCategoryFormRef.model.name,
              description: this.editCategoryFormRef.model.description || null,
            }).then(res => {
              this.message.success(`Categoria ${this.currentCategory.name} atualizada com sucesso`);
              this.loadingBar.finish();
              this.showEditModal = false;
            }).catch(err => {
              this.message.error(`Erro ao tentar editar a categoria ${this.currentCategory.name}`);
              console.error(err);
              this.loadingBar.error();
            }).finally(() => {
              this.updateCategories();
            });
          } else {
            // console.log(errors);
          }
        },
      );
    },
  },
};
</script>

<style>

</style>
