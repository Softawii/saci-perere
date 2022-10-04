<template>
  <n-space vertical size="large">
    <n-layout-header>
      <Navbar />
    </n-layout-header>
    <n-layout-content>
      <Sidebar @menu-updated="show">
        <CategoryTab @updated="tabUpdated">
          <CategoryList :type="categoryListType" />
        </CategoryTab>
      </Sidebar>
    </n-layout-content>
  </n-space>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import CategoryList from '../components/CategoryList.vue';
import CategoryTab from '../components/CategoryTab.vue';

export default {
  components: {
    Sidebar,
    CategoryList,
    CategoryTab,
    Navbar,
  },
  setup() {
  },
  data() {
    return {
      categoryListType: 'all',
    };
  },
  computed: {
  },
  beforeMount() {
  },
  methods: {
    show(data) {
      console.log(data);
      alert(data);
    },
    tabUpdated(key) {
      this.categoryListType = key;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
