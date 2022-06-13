<template>
  <div class="_background">
    <i-container>
      <div v-for="alert in alertInfo" :key="alert">
        <i-row center style="margin: 2px 4px;">
          <i-alert class="_small" dismissible :color="alert.alertType">
            <template #icon>
              <i-icon :name="alert.alertIcon" />
            </template>
            <p>{{ alert.msgBox }}</p>
          </i-alert>
        </i-row>
      </div>
      <div class="_display:flex _justify-content:space-between">
        <div class="_font-size:xl" style="margin: 10px 10px 0">
          Categorias:
        </div>
        <div class="_align-self:end" style="margin-right: 10px;">
          <Refresh @click="reloadCategories" />
        </div>
      </div>
      <i-row>
        <i-list-group style="width: 100%; margin: 0 10px">
          <i-list-group-item v-for="category in categories" :key="category.name">
            <div class="_clearfix">
              <router-link class="link" :to="{name: 'Category', params: {id: category.id}}">
                <span class="_vertical-align:text-top"> <!-- _float:right -->
                  {{ category.name }}
                </span>
              </router-link>
              <span class="_float:right">
                <i-dropdown>
                  <DotsVertical />
                  <template #body>
                    <i-dropdown-item @click="renameCategoryModal(category.id)">Editar nome</i-dropdown-item>
                    <i-dropdown-divider />
                    <i-dropdown-item disabled>Sair da categoria</i-dropdown-item>
                    <i-dropdown-divider />
                    <i-dropdown-item @click="apagarCategoria(category.id, category.name)">Apagar</i-dropdown-item>
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
      alertInfo: [],
    };
  },
  computed: {
    ...mapStores(useGlobalStore, useUserStore),
  },
  beforeMount() {
    this.loadUserDetails();
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
      axios.post('/categories', {
        name,
      }).then(() => {
        this.isAddingSubject = false;
        this.reloadCategories();
        this.alertBox('Nova categoria criada com sucesso!', 'success');
      }).catch(err => {
        console.error(err);
        this.addNewCategoryError = err;
        this.reloadCategories();
      });
    },
    apagarCategoria(id, name) {
      axios.post('/delete', {
        id,
        name,
      }).then(() => {
        this.reloadCategories();
        this.alertBox('Categoria apagada com sucesso!', 'success');
      }).catch(err => {
        console.error(err);
        this.reloadCategories();
        this.alertBox('Ocorreu um erro ao apagar a categoria.', 'danger');
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
      axios.post('/categories/rename', {
        name: currentCategory.name,
        id: currentCategory.id,
      }).then(response => {
        this.reloadCategories();
        this.isRenamingCategory = false;
        this.alertBox('Nome da categoria alterado com sucesso!', 'success');
      }).catch(err => {
        console.error(err);
        this.renamingCategoryError = err;
        this.reloadCategories();
      });
    },
    reloadCategories() {
      axios.get('/categories', {
      }).then(response => {
        this.categories = response.data.categories;
      });
    },
    alertBox(msg, type) {
      let icon;
      if (type === 'success') icon = 'ink-check';
      else icon = `ink-${type}`;
      this.alertInfo.push({
        msgBox: msg,
        alertType: type,
        alertIcon: icon,
      });
    },
    loadUserDetails() {
      axios.get('/user/details', {
      }).then(response => {
        this.userStore.setUserDetails(response.data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
