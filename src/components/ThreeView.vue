<template>
  <div id="three-mount">
  </div>
</template>

<script>
export default {
  name: 'three-view',
  mounted() {
    this.$emit('threeViewMounted', this.$el);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#three-mount {
  position: relative;
  height: 100vh;
  width: 100vw;
}
#three-mount canvas {
  height: 100vh;
  width: 100vw;
}
</style>
