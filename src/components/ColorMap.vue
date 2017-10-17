<template>
  <canvas class="color-map"></canvas>
</template>

<script>
/**
 * curve-tool-widget renders the CanvasSpliner's DOM element
 * and allows the user to change the type of the spline.
 */
export default { name: 'colormap' };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color-map {
  width: 30;
  height: 250;
}
</style>
