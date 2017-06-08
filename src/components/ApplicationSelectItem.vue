
<template>
  <div class="app-option">
    {{ this.option.name }}
  </div>
</template>

<script>
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
