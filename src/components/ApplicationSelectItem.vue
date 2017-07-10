
<template>
  <div class="app-option">
    {{ this.option.name }}
  </div>
</template>

<script>
/**
 * application-select-item renders a single application option to load
 * when creating an application.
 */
export default {
  name: 'application-select-item',
  props: ['option'],
};
</script>

<style scoped>
.app-option:hover {
  background-color: #999;
  color: #fff;
  cursor: pointer;
}
</style>
