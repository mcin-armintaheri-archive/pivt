
<template>
  <div v-bind:class="appItemClass">
    {{ this.option.name }}
  </div>
</template>

<script>
export default {
  name: 'application-select-item',
  props: ['option', 'active'],
  computed: {
    appItemClass() {
      return { 'active-option': this.active };
    },
  },
};
</script>

<style scoped>
.active-option {
  background-color: #f00;
}
</style>
