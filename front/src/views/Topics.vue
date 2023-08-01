<template>
  <TopicTab @updated="tabUpdated">
    <NewTopic v-show="topicListType === 'new-topic'" />
    <TopicList v-show="topicListType === 'all' || topicListType === 'favorites'" :type="topicListType" />
  </TopicTab>
</template>

<script>
import TopicList from '../components/topic/TopicList.vue';
import TopicTab from '../components/topic/TopicTab.vue';
import NewTopic from '../components/topic/NewTopic.vue';

export default {
  components: {
    TopicList,
    TopicTab,
    NewTopic,
  },
  data() {
    return {
      topicListType: 'all',
    };
  },
  methods: {
    show(data) {
      console.log(data);
      alert(data);
    },
    tabUpdated(key) {
      this.topicListType = key;
    },
  },
};
</script>
