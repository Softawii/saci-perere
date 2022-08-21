<template>
  <CategoryTab @updated="tabUpdated">
    <CategoryList :type="categoryListType" />
  </CategoryTab>
</template>

<script>
import CategoryList from '../components/CategoryList.vue';
import CategoryTab from '../components/CategoryTab.vue';

export default {
  components: {
    CategoryList,
    CategoryTab,
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
