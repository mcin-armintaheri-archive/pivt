<template>
  <div class="container">
    <ul>
      <li>Press T and use the pimrary mouse button to drag any planes in the Perspective view.</li>
      <li>Press R and use the pimrary mouse button to perform obliques along any planes in the Perspective view.</li>
      <li>Press Space and use the pimrary mouse button to sample the intensity of the image along a line in the Perspective view.</li>
      <li>Right click and drag on any view to pan the camera.</li>
      <li>Scroll on any view to zoom the camera.</li>
      <li>Left click on any Orthographic view to place the 3D cursor at that position.</li>
    </ul>
  </div>
</template>

<script>

/**
 * The sidebar button for opening the controls window.
 */
export default {
  name: 'brain-slicer-help-window-content',
  props: ['controller']
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  background-color: #fff;
}
</style>
