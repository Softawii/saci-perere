<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="false"
  />
</template>

<script>
import { h, defineComponent } from 'vue';
import { NButton, NTag } from 'naive-ui';

const createColumns = () => [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Nome',
    key: 'name',
  },
  {
    title: 'Username',
    key: 'username',
  },
  {
    title: 'ADMIN',
    key: 'isAdmin',
    render(row) {
      return h(
        NTag,
        {
          type: row.isAdmin ? 'success' : 'error',
          textContent: row.isAdmin ? 'Sim' : 'Não',
        },
      );
    },
  },
  {
    title: 'Definir como Administrador',
    key: 'set-admin',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: row.isAdmin ? 'success' : 'error',
          onClick: () => {
            alert(row.isAdmin ? 'Remover permissão' : 'Dar permissão');
          },
          textContent: row.isAdmin ? 'Remover permissão' : 'Dar permissão',
        },
      );
    },
  },
];

const data = [
  {
    id: 0,
    name: 'Eduardo Cabral',
    username: 'eduardoferro',
    isAdmin: false,
  },
  {
    id: 1,
    name: 'Romulo Menezes',
    username: 'sulumor',
    isAdmin: true,
  },
  {
    id: 2,
    name: 'Leandro Alvim',
    username: 'lalvim',
    isAdmin: true,
  },
];

export default {
  setup() {
    return {
      data,
      columns: createColumns(),
      pagination: false,
    };
  },
};
</script>
