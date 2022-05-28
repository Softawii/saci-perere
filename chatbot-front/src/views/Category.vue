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
              {{ category.name }}
            </span>
          </i-navbar-brand>
          <i-navbar-collapsible>
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
      <i-row>
        <p class="_font-size:xl" style="margin: 10px 10px 0">
          Perguntas e respostas:
        </p>
        <i-card v-for="question in category.questions" :key="question.question" style="width: 100%; margin: 0 10px 5px">
          <template #header>
            <div class="_clearfix">
              <span class="_vertical-align:text-top"> <!-- _float:right -->
                {{ question.question }}
              </span>
              <span class="_float:right">
                <i-dropdown>
                  <DotsVertical />
                  <template #body>
                    <i-dropdown-item>Editar</i-dropdown-item>
                    <i-dropdown-item>Apagar</i-dropdown-item>
                  </template>
                </i-dropdown>
              </span>
            </div>
          </template>
          <p v-for="answer in question.answers" :key="answer">
            {{ answer }}
          </p>
        </i-card>
      </i-row>
      <i-row center>
        <div @click="adicionarAssunto">
          <p class="_font-size:xl" style="margin-bottom: 0">
            Adicionar mais perguntas
          </p>
          <i-icon name="ink-plus" />
        </div>
      </i-row>
    </i-container>
  </div>
</template>

<script>
import categoryJson from '../data/category.json';

export default {
  data() {
    return {
      category: categoryJson,
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
#main {
  background-color: #DDE2E4;
}
</style>
