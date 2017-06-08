<template>
  <div class="app-select">
    <application-select-item
      class="app-select-item"
      v-for="option in options"
      :key="option.name"
      v-bind:option="option"
      v-on:click.native="selectItem(option)"
    >
    </application-select-item>
  </div>
</template>

<script>
import ApplicationSelectItem from '@/components/ApplicationSelectItem';

export default {
  name: 'application-select',
  components: {
    applicationSelectItem: ApplicationSelectItem,
  },
  props: ['options'],
  methods: {
    selectItem(option) {
      this.$emit('applicationSelect', option);
    },
  },
};
</script>

<style scoped>
</style>
