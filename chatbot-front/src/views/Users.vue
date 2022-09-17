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

export default {
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
      loadingBar: useLoadingBar(),
      users: ref([]),
      columns: ref([]),
      pagination: false,
    };
  },
  mounted() {
    this.columns = this.createColumns();
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
  methods: {
    createColumns() {
      const vm = this;
      return [
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
          key: 'isadmin',
          align: 'center',
          render(row) {
            return h(
              NTag,
              {
                type: row.isadmin ? 'success' : 'error',
                textContent: row.isadmin ? 'Sim' : 'Não',
              },
            );
          },
        },
        {
          title: 'Definir como Administrador',
          key: 'set-admin',
          align: 'center',
          render(row) {
            const isUserAdmin = vm.userStore.profile?.isadmin;
            return h(
              NButton,
              {
                size: 'small',
                type: row.isadmin ? 'success' : 'error',
                disabled: !isUserAdmin || row.isadmin || row.email === vm.userStore.profile?.email,
                onClick: () => {
                  vm.giveAdmin(row.id);
                },
                textContent: row.isadmin ? 'Remover permissão' : 'Dar permissão',
              },
            );
          },
        },
      ];
    },
    giveAdmin(id) {
      alert(id);
    },
  },
};
</script>
