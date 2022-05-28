<script setup>
import DotsVertical from '../components/icons/DotsVertical.vue';
</script>
<template>
  <div id="main" style="min-height: 100vh; min-width: 100vw;">
    <i-container>
      <i-row center>
        <i-navbar id="navbar" style="min-width: 99%; margin: 2px 4px;">
          <i-navbar-brand to="/">
            <span>
              Olá, Fulano de Tal
            </span>
          </i-navbar-brand>
          <i-navbar-collapsible id="aaa">
            <i-nav>
              <i-nav-item to="/">
                Logout
              </i-nav-item>
              <i-nav-item to="/about">
                Cadastrar Usuário
              </i-nav-item>
              <i-nav-item to="/contact">
                Contact
              </i-nav-item>
            </i-nav>
            <i-input placeholder="Type something..">
              <template #append>
                <i-button color="primary">
                  <i-icon name="ink-search" />
                </i-button>
              </template>
            </i-input>
          </i-navbar-collapsible>
        </i-navbar>
      </i-row>
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
          <i-list-group-item v-for="categoria in categorias" :key="categoria.name">
            <div class="_clearfix">
              <span class="_vertical-align:text-top"> <!-- _float:right -->
                {{ categoria.name }}
              </span>
              <span class="_float:right">
                <i-dropdown>
                  <DotsVertical />
                  <template #body>
                    <i-dropdown-item @click="renameCategoryModal(categoria.id)">Editar nome</i-dropdown-item>
                    <i-dropdown-divider />
                    <i-dropdown-item disabled>Sair da categoria</i-dropdown-item>
                    <i-dropdown-divider />
                    <i-dropdown-item @click="apagarCategoria(categoria.id)">Apagar</i-dropdown-item>
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
import categoriesJson from '../data/categories.json';

export default {
  data() {
    return {
      temaSelecionado: undefined,
      novoTema: '',
      isAddingSubject: false,
      isRenamingCategory: false,
      oldCategoryName: undefined,
      newCategoryName: undefined,
      newCategoryId: undefined,
      categorias: categoriesJson,
      categoriasFiltrados: undefined,
    };
  },
  computed: {
  },
  methods: {
    adicionarAssunto() {
      this.temaSelecionado = undefined;
      this.novoTema = '';
      this.isAddingSubject = true;
      this.categoriasFiltrados = this.categorias.map(categoria => ({
        id: categoria.id,
        label: categoria.name,
      }));
    },
    nomesTemas(query) {
      this.categoriasFiltrados = this.categorias.map(categoria => ({
        id: categoria.id,
        label: categoria.name,
      })).filter(option => option.label.toLowerCase().includes((query || '').toLowerCase()));
      return this.categoriasFiltrados;
    },
    adicionarCategoria() {
      this.isAddingSubject = false;
      const name = this.temaSelecionado || this.novoTema;
      const ultimaCategoria = this.categorias[this.categorias.length - 1];
      const id = ultimaCategoria.id + 1;
      this.categorias.push({
        name,
        id,
      });
    },
    apagarCategoria(id) {
      this.categorias = this.categorias.filter(categoria => categoria.id !== id);
    },
    renameCategoryModal(id) {
      const currentCategory = this.categorias.filter(categoria => categoria.id === id)[0];
      this.newCategoryName = '';
      this.oldCategoryName = currentCategory.name;
      this.newCategoryId = currentCategory.id;

      this.isRenamingCategory = true;
    },
    renameCategory() {
      const currentCategory = this.categorias.filter(categoria => categoria.id === this.newCategoryId)[0];
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
