<template>
  <div id="three-mount">
    <canvas class="three-mount-canvas"></canvas>
  </div>
</template>

<script>
const THREE = require('three');
/**
 * When the three-view component is mounted, a threejs WebGLRenderer
 * is instantiated and emmitted in the payload of the three-view-mounted
 * event. The parent may use the canvas element and the renderer emmitted
 * by the event to pass them to running applications.
 * @type {String}
 */
export default {
  name: 'three-view',
  mounted() {
    const canvas = this.$el.querySelector('.three-mount-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });

    renderer.setViewport(0, 0, canvas.width, canvas.height);
    renderer.setScissor(0, 0, canvas.width, canvas.height);
    renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));
    renderer.clear(true, true, true);

    this.$emit('threeViewMounted', { element: this.$el, renderer });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#three-mount {
  position: relative;
  height: 100vh;
  width: 100vw;
  z-index: 0;
}
#three-mount .three-mount-canvas {
  height: 100vh;
  width: 100vw;
}
</style>
