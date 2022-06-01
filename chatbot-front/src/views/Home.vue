<template>
  <div id="main">
    <i-container>
      <i-row center style="margin: 2px 4px;">
        <i-alert dismissible color="info">
          <template #icon>
            <i-icon name="ink-info" />
          </template>
          <p>informação não mt importante</p>
        </i-alert>
      </i-row>
      <i-row center style="margin: 2px 4px;">
        <i-alert dismissible color="success">
          <template #icon>
            <i-icon name="ink-check" />
          </template>
          <p>xxxxxxxxx com sucesso</p>
        </i-alert>
      </i-row>

      <i-row center style="margin: 2px 4px;">
        <i-alert dismissible color="warning">
          <template #icon>
            <i-icon name="ink-warning" />
          </template>
          <p>Modelo será treinado em xx minutos</p>
        </i-alert>
      </i-row>

      <i-row center style="margin: 2px 4px;">
        <i-alert dismissible color="danger">
          <template #icon>
            <i-icon name="ink-danger" />
          </template>
          <p>Falha ao xxxxxxxxx</p>
        </i-alert>
      </i-row>
      <div class="_display:flex _justify-content:space-between">
        <div class="_font-size:xl" style="margin: 10px 10px 0">
          Categorias:
        </div>
        <div class="_align-self:end" style="margin-right: 10px;">
          <Refresh @click="reloadCategories" />
        </div>
      </div>
      <i-row>
        <i-list-group color="light" style="width: 100%; margin: 0 10px">
          <i-list-group-item v-for="category in categories" :key="category.name">
            <div class="_clearfix">
              <span class="_vertical-align:text-top"> <!-- _float:right -->
                {{ category.name }}
              </span>
              <span class="_float:right">
                <i-dropdown>
                  <DotsVertical />
                  <template #body>
                    <i-dropdown-item @click="renameCategoryModal(category.id)">Editar nome</i-dropdown-item>
                    <i-dropdown-divider />
                    <i-dropdown-item disabled>Sair da categoria</i-dropdown-item>
                    <i-dropdown-divider />
                    <i-dropdown-item @click="apagarCategoria(category.id)">Apagar</i-dropdown-item>
                  </template>
                </i-dropdown>
              </span>
            </div>
          </i-list-group-item>
        </i-list-group>
      </i-row>
      <i-row center>
        <div @click="addCategoryModal">
          <p class="_font-size:xl" style="margin-bottom: 0">
            Adicionar mais categorias
          </p>
          <i-icon name="ink-plus" />
        </div>
      </i-row>
    </i-container>
    <i-modal v-model="isAddingSubject">
      <template #header>
        Adicionar nova categoria
      </template>
      <i-alert v-if="addNewCategoryError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ addNewCategoryError }}</p>
      </i-alert>
      <i-form>
        <i-form-group>
          <i-form-label>Crie uma nova categoria:</i-form-label>
          <i-input
            v-model="newCategory" placeholder="Nova categoria..." :clearable="true"
            :disabled="Boolean(selectedCategory && selectedCategory.label)"
          />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-tooltip :disabled="newCategory.length !== 0" placement="bottom">
              <i-button :disabled="newCategory.length === 0" :color="newCategory.length === 0 ? 'danger' : 'primary'" @click="addNewCategory">
                Confirmar
              </i-button>
              <template #body>
                Digite algo no campo acima
              </template>
            </i-tooltip>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
    <i-modal v-model="isRenamingCategory">
      <template #header>
        Renomear Categoria
      </template>
      <i-alert v-if="renamingCategoryError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ renamingCategoryError }}</p>
      </i-alert>
      <i-form>
        <i-form-group>
          <i-form-label>Novo nome para {{ oldCategoryName }}:</i-form-label>
          <i-input v-model="newCategoryName" :placeholder="oldCategoryName" :clearable="true" />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="primary" @click="renameCategory">
              Confirmar
            </i-button>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';
import DotsVertical from '../components/icons/DotsVertical.vue';
import Refresh from '../components/icons/Refresh.vue';

export default {
  components: {
    DotsVertical,
    Refresh,
  },
  data() {
    return {
      selectedCategory: undefined,
      newCategory: '',
      isAddingSubject: false,
      isRenamingCategory: false,
      oldCategoryName: undefined,
      newCategoryName: undefined,
      newCategoryId: undefined,
      categories: [],
      addNewCategoryError: undefined,
      renamingCategoryError: undefined,
    };
  },
  computed: {
    ...mapStores(useGlobalStore, useUserStore),
  },
  beforeMount() {
    this.reloadCategories();
  },
  methods: {
    ...mapActions(useUserStore, ['clearCredentials']),
    addCategoryModal() {
      this.selectedCategory = undefined;
      this.newCategory = '';
      this.isAddingSubject = true;
    },
    addNewCategory() {
      const name = this.selectedCategory || this.newCategory;
      axios.post(`${this.globalStore.apiUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
        },
        name,
      }).then(() => {
        this.isAddingSubject = false;
        this.reloadCategories();
      }).catch(err => {
        console.error(err);
        this.addNewCategoryError = err;
        this.reloadCategories();
      });
    },
    apagarCategoria(id) {
      axios.post(`${this.globalStore.apiUrl}/categories/delete`, {
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
        },
        id,
      }).then(() => {
        this.reloadCategories();
      }).catch(err => {
        console.error(err);
        this.reloadCategories();
      });
    },
    renameCategoryModal(id) {
      const currentCategory = this.categories.filter(categoria => categoria.id === id)[0];
      this.newCategoryName = '';
      this.oldCategoryName = currentCategory.name;
      this.newCategoryId = currentCategory.id;

      this.isRenamingCategory = true;
    },
    renameCategory() {
      const currentCategory = this.categories.filter(categoria => categoria.id === this.newCategoryId)[0];
      currentCategory.name = this.newCategoryName;
      axios.post(`${this.globalStore.apiUrl}/categories/rename`, {
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
        },
        name: currentCategory.name,
        id: currentCategory.id,
      }).then(response => {
        this.reloadCategories();
        this.isRenamingCategory = false;
      }).catch(err => {
        console.error(err);
        this.renamingCategoryError = err;
        this.reloadCategories();
      });
    },
    reloadCategories() {
      axios.get(`${this.globalStore.apiUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
        },
      }).then(response => {
        this.categories = response.data.categories;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  background-color: #DDE2E4;
}
</style>
