<template>
  <div class="container">
    <el-button
      type="primary"
      @click="controller.windowConfig.open = true"
    >
      Show Segment Intensity Plot
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'spectrum-plot-sidebar-widget',
  props: ['controller'],
};
</script>

<style>
</style>
