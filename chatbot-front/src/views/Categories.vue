<template>
  <CategoryTab @updated="tabUpdated">
    <NewCategory v-show="categoryListType === 'new-category'" />
    <CategoryList v-show="categoryListType === 'all' || categoryListType === 'favorites'" :type="categoryListType" />
  </CategoryTab>
</template>

<script>
import CategoryList from '../components/category/CategoryList.vue';
import CategoryTab from '../components/category/CategoryTab.vue';
import NewCategory from '../components/category/NewCategory.vue';

export default {
  components: {
    CategoryList,
    CategoryTab,
    NewCategory,
  },
  data() {
    return {
      categoryListType: 'all',
    };
  },
  methods: {
    tabUpdated(key) {
      this.categoryListType = key;
    },
  },
};
</script>
