<template>
  <n-list hoverable clickable>
    <n-list-item v-for="category in filteredCategories" :key="category.name">
      <n-thing :title="category.name" content-style="margin-top: 10px;">
        <template #description>
          <n-space v-if="category.isFavorite" size="small" style="margin-top: 4px">
            <n-tag :bordered="false" type="warning" size="small">
              Favorito
              <template #icon>
                <n-icon :component="StarIcon" />
              </template>
            </n-tag>
          </n-space>
        </template>
        {{ category.description }}
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script>
import {
  Star as StarIcon,
} from '@vicons/ionicons5';

export default {
  components: {
  },
  props: {
    type: {
      type: String,
      default: 'all',
    },
  },
  setup() {
    return {
      StarIcon,
    };
  },
  data() {
    const categories = [
      {
        name: 'Ações, Programas e Políticas do SUS',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isFavorite: true,
      },
      {
        name: 'Agenda de Autoridades do Ministério da Saúde',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isFavorite: false,
      },
      {
        name: 'Assistência Farmacêutica',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isFavorite: true,
      },
    ];
    return {
      categories,
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => {
        if (this.type === 'favorites') return category.isFavorite === true;
        return true;
      });
    },
  },
};
</script>

<style>

</style>
