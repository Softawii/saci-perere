<template>
  <CategoryTab @updated="tabUpdated">
    <NewCategory v-if="categoryListType === 'new-category'" />
    <CategoryList v-else :type="categoryListType" />
  </CategoryTab>
</template>

<script>
import CategoryList from '../components/CategoryList.vue';
import CategoryTab from '../components/CategoryTab.vue';
import NewCategory from '../components/NewCategory.vue';

export default {
  components: {
    CategoryList,
    CategoryTab,
    NewCategory,
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
