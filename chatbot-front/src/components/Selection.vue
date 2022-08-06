<template>
  <div>
    <p
      ref="container" class="_border _border-radius _border-color:light"
      style="white-space: pre-wrap; overflow: auto;" :style="{maxHeight: maxHeight}"
    >
      {{ text }}
    </p>
    <i-button color="primary" block @click="save">
      {{ buttonText }}
    </i-button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: 'Salvar',
    },
    maxHeight: {
      type: String,
      default: '300px',
    },
  },
  emits: ['selection'],
  data() {
    return {
      selectedText: undefined,
      anchorOffset: undefined,
      focusOffset: undefined,
    };
  },
  mounted() {
    document.addEventListener('selectionchange', () => {
      const element = this.$refs.container;
      const selection = window.getSelection();
      if (selection.focusNode && selection.focusNode.parentElement === element) {
        if (selection.type === 'Range') {
          this.anchorOffset = selection.anchorOffset;
          this.focusOffset = selection.focusOffset;
          this.selectedText = selection.toString();
          this.save();
        }
      }
    });
  },
  methods: {
    getCurrentSelection() {
      return window.getSelection();
    },
    // eslint-disable-next-line consistent-return
    save() {
      const selection = this.getCurrentSelection();
      const text = selection.toString().trim();
      if (text) {
        const min = Math.min(selection.anchorOffset, selection.focusOffset);
        const max = Math.max(selection.anchorOffset, selection.focusOffset);
        const start = (min <= 1) ? 0 : min;
        const end = (max <= 1) ? 0 : max;
        const size = end - start;
        if (size > 0) {
          return this.$emit('selection', {
            anchorOffset: selection.anchorOffset,
            focusOffset: selection.focusOffset,
            text,
            size,
            start,
            end,
          });
        }
      }
      this.$emit('selection', undefined);
    },
  },
};
</script>

<style>
</style>
