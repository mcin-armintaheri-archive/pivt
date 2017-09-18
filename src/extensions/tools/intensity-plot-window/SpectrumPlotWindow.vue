<template>
  <div class="container">
  </div>
</template>

<script>
/**
 * spectrum-plot-window is a container component for SpectrumPlot2 to mount its
 * plot into when the component itself is mounted.
 */
export default {
  name: 'spectrum-plot-window',
  props: ['controller'],
  mounted() {
    this.controller.initialize(this.$el);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  background-color: #fff;
}
</style>
