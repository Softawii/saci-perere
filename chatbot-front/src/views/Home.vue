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
      <i-row>
        <p class="_font-size:xl" style="margin: 10px 10px 0">
          Categorias:
        </p>
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
        <div @click="adicionarAssunto">
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
      <i-form>
        <!-- <i-form-group>
          <i-form-label>Entre em uma categoria já existente:</i-form-label>
          <i-select
            v-model="temaSelecionado" :options="categoriasFiltrados" autocomplete placeholder="Escolha uma categoria..."
            :disabled="novoTema.length > 0" :clearable="true" @search="nomesTemas"
          />
        </i-form-group> -->
        <i-form-group>
          <i-form-label>Crie uma nova categoria:</i-form-label>
          <i-input
            v-model="novoTema" placeholder="Nova categoria..." :clearable="true"
            :disabled="Boolean(temaSelecionado && temaSelecionado.label)"
          />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-tooltip :disabled="novoTema.length !== 0" placement="bottom">
              <i-button :disabled="novoTema.length === 0" :color="novoTema.length === 0 ? 'danger' : 'primary'" @click="adicionarCategoria">
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

export default {
  components: {
    DotsVertical,
  },
  data() {
    return {
      temaSelecionado: undefined,
      novoTema: '',
      isAddingSubject: false,
      isRenamingCategory: false,
      oldCategoryName: undefined,
      newCategoryName: undefined,
      newCategoryId: undefined,
      categories: [],
      categoriasFiltrados: undefined,
    };
  },
  computed: {
    ...mapStores(useGlobalStore, useUserStore),
  },
  beforeMount() {
    axios.get(`${this.globalStore.apiUrl}/categories`, {
      headers: {
        Authorization: `Bearer ${this.userStore.token}`,
      },
    })
      .then(response => {
        this.categories = response.data.categories;
      });
  },
  methods: {
    ...mapActions(useUserStore, ['clearCredentials']),
    adicionarAssunto() {
      this.temaSelecionado = undefined;
      this.novoTema = '';
      this.isAddingSubject = true;
      this.categoriasFiltrados = this.categories.map(categoria => ({
        id: categoria.id,
        label: categoria.name,
      }));
    },
    nomesTemas(query) {
      this.categoriasFiltrados = this.categories.map(categoria => ({
        id: categoria.id,
        label: categoria.name,
      })).filter(option => option.label.toLowerCase().includes((query || '').toLowerCase()));
      return this.categoriasFiltrados;
    },
    adicionarCategoria() {
      this.isAddingSubject = false;
      const name = this.temaSelecionado || this.novoTema;
      const ultimaCategoria = this.categories[this.categories.length - 1];
      const id = ultimaCategoria.id + 1;
      this.categories.push({
        name,
        id,
      });
    },
    apagarCategoria(id) {
      this.categories = this.categories.filter(categoria => categoria.id !== id);
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

      this.isRenamingCategory = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  background-color: #DDE2E4;
}
</style>
