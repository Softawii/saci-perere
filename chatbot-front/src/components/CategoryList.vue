<template>
  <n-list hoverable clickable>
    <n-list-item v-for="category in filteredCategories" :key="category.name">
      <template #suffix>
        <n-dropdown trigger="hover" :options="categoryOptions" @select="(key) => handleSelect(key, category)">
          <n-button>
            <template #icon>
              <n-icon :component="EllipsisVerticalIcon" />
            </template>
          </n-button>
        </n-dropdown>
      </template>
      <n-thing :title="category.name" content-style="margin-top: 10px;" @click="openCategory(category.id)">
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
import axios from 'axios';
import {
  Star as StarIcon,
  EllipsisVerticalOutline as EllipsisVerticalIcon,
  Trash as TrashIcon,
  DocumentText as DocumentTextIcon,
} from '@vicons/ionicons5';
import { useLoadingBar, NIcon } from 'naive-ui';
import { h } from 'vue';
import { useGlobalStore } from '../store/GlobalStore';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

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
      EllipsisVerticalIcon,
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      categoryOptions: [
        {
          label: 'Apagar',
          key: 'delete',
          icon: renderIcon(TrashIcon),
        },
        {
          label: 'Editar',
          key: 'edit',
          icon: renderIcon(DocumentTextIcon),
        },
        {
          label: 'Favorito',
          key: 'favorite',
          icon: renderIcon(StarIcon),
        },
      ],
    };
  },
  data() {
    return {
      categories: [],
      currentCategory: {},
    };
  },
  computed: {
    filteredCategories() {
      if (!this.globalStore.data?.categories) {
        return [];
      }
      return this.globalStore.data.categories.filter(category => {
        if (this.type === 'favorites') return category.isFavorite === true;
        return true;
      });
    },
  },
  mounted() {
    if (!this.globalStore.data.categories?.length) {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/category`)
        .then(res => {
          this.categories = res.data;
          this.globalStore.data.categories = this.categories;
          this.loadingBar.finish();
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
        });
    }
  },
  methods: {
    openCategory(id) {
      this.$router.push(`/category/${id}`);
    },
    handleSelect(key, category) {
      this.currentCategory = category;
      if (key === 'edit') {
        this.showEditModal = true;
      }
      if (key === 'delete') {
        this.showDeleteModal = true;
      }
      if (key === 'favorite') {
        this.currentCategory.isFavorite = !category.isFavorite;
      }
    },
  },
};
</script>

<style>

</style>
