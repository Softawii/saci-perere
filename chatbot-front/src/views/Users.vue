<template>
  <n-data-table
    :columns="columns"
    :data="users"
    :pagination="pagination"
    :bordered="false"
    :single-line="false"
  />
</template>

<script>
import axios from 'axios';
import { h, ref } from 'vue';
import { NButton, NTag, useLoadingBar } from 'naive-ui';
import { useUserStore } from '../store/UserStore';

const createColumns = userStore => [
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
    align: 'center',
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
    align: 'center',
    render(row) {
      const isUserAdmin = userStore.profile?.isAdmin;
      return h(
        NButton,
        {
          size: 'small',
          type: row.isAdmin ? 'success' : 'error',
          disabled: !isUserAdmin,
          onClick: () => {
            alert(row.isAdmin ? 'Remover permissão' : 'Dar permissão');
          },
          textContent: row.isAdmin ? 'Remover permissão' : 'Dar permissão',
        },
      );
    },
  },
];

export default {
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
      loadingBar: useLoadingBar(),
      users: ref([]),
      columns: createColumns(userStore),
      pagination: false,
    };
  },
  mounted() {
    const apiUrl = import.meta.env.VITE_API_URL;
    this.loadingBar.start();
    axios.get(`${apiUrl}/user/`)
      .then(res => {
        this.users = res.data;
        this.loadingBar.finish();
      }).catch(err => {
        console.error(err);
        this.loadingBar.error();
      });
  },
};
</script>
