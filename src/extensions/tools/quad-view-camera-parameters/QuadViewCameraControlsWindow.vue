<template>
  <div class="container">
    <div class="controls-container">
      <div class="top-row">
        <viewport-controls
          title="XY Plane"
          v-bind:camControls="controller.getTopRight()"
          v-bind:controller="controller"
        >
          <ortho-controls
            v-bind:camControls="controller.getTopRight()"
            slot="extra-controls"
          >
          </ortho-controls>
        </viewport-controls>
        <viewport-controls
          title="YZ Plane"
          v-bind:camControls="controller.getTopLeft()"
          v-bind:controller="controller"
        >
          <ortho-controls
            slot="extra-controls"
            v-bind:camControls="controller.getTopLeft()"
          >
          </ortho-controls>
        </viewport-controls>
      </div>
      <div class="bottom-row">
        <viewport-controls
          title="XZ Plane"
          v-bind:camControls="controller.getBottomLeft()"
          v-bind:controller="controller"
        >
          <ortho-controls
            slot="extra-controls"
            v-bind:camControls="controller.getBottomLeft()"
          >
          </ortho-controls>
        </viewport-controls>
        <viewport-controls
          title="Perspective View"
          v-bind:camControls="controller.getBottomRight()"
          v-bind:controller="controller"
        >
          <trackball-controls
            slot="extra-controls"
            v-bind:controller="controller"
          ></trackball-controls>
        </viewport-controls>
      </div>
    </div>
  </div>
</template>

<script>
import ViewportControls from './ViewportControls';
import TrackballControls from './TrackballControls';
import OrthoControls from './OrthoControls';

/**
 * quad-view-camera-controls shows a 2x2 table of inputs for controlling
 * the quadview layout viewports.
 */
export default {
  name: 'quad-view-camera-controls-window',
  components: {
    'viewport-controls': ViewportControls,
    'trackball-controls': TrackballControls,
    'ortho-controls': OrthoControls
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
  background-color: #555;
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
