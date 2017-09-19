<template>
  <div class="container">
    <div class="widget-title">
      <h3>Camera Controls (Degrees):</h3>
    </div>
    <div class="controls-container">
      <div class="top-row">
        <orthographic-controls
          title="XY Plane"
          v-bind:camControls="controller.getTopRight()"
          v-bind:controller="controller"
        >
        </orthographic-controls>
        <orthographic-controls
          title="YZ Plane"
          v-bind:camControls="controller.getTopLeft()"
          v-bind:controller="controller"
        >
        </orthographic-controls>
      </div>
      <div class="bottom-row">
        <orthographic-controls
          title="XZ Plane"
          v-bind:camControls="controller.getBottomLeft()"
          v-bind:controller="controller"
        >
        </orthographic-controls>
        <perspective-controls
          title="Perspective View"
          v-bind:controller="controller"
        >
        </perspective-controls>
      </div>
    </div>
  </div>
</template>

<script>
import OrthographicControls from './OrthographicControls';
import PerspectiveControls from './PerspectiveControls';

/**
 * quad-view-camera-controls shows a 2x2 table of inputs for controlling
 * the quadview layout viewports.
 */
export default {
  name: 'quad-view-camera-controls',
  components: {
    'orthographic-controls': OrthographicControls,
    'perspective-controls': PerspectiveControls
  },
  props: ['controller'],
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.controls-container {
  display: flex;
  flex-direction: column;
}
.controls-container .top-row {
  display: flex;
  flex-direction: row;
}
.controls-container .bottom-row {
  display: flex;
  flex-direction: row;
}
</style>
