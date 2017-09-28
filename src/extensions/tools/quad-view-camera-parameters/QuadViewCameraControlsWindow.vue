<template>
  <div class="container">
    <div class="controls-container">
      <div class="top-row">
        <viewport-controls
          v-bind:camControls="controller.getCamControls(0)"
          v-bind:controller="controller"
          v-on:swap-viewport="c => controller.swapViewport(0, c, swapModes)"
          v-bind:swap-mode="swapModes[0]"
        >
        </viewport-controls>
        <viewport-controls
          v-bind:camControls="controller.getCamControls(1)"
          v-bind:controller="controller"
          v-on:swap-viewport="c => controller.swapViewport(1, c, swapModes)"
          v-bind:swap-mode="swapModes[1]"
        >
        </viewport-controls>
      </div>
      <div class="bottom-row">
        <viewport-controls
          v-bind:camControls="controller.getCamControls(2)"
          v-bind:controller="controller"
          v-on:swap-viewport="c => controller.swapViewport(2, c, swapModes)"
          v-bind:swapMode="swapModes[2]"
        >
        </viewport-controls>
        <viewport-controls
          v-bind:camControls="controller.getCamControls(3)"
          v-bind:controller="controller"
          v-on:swap-viewport="c => controller.swapViewport(3, c, swapModes)"
          v-bind:swap-mode="swapModes[3]"
        >
        </viewport-controls>
      </div>
    </div>
  </div>
</template>

<script>
import ViewportControls from './ViewportControls';

/**
 * quad-view-camera-controls shows a 2x2 table of inputs for controlling
 * the quadview layout viewports.
 */
export default {
  name: 'quad-view-camera-controls-window',
  components: {
    'viewport-controls': ViewportControls
  },
  props: ['controller'],
  data() {
    return {
      swapModes: [
        'Swap Viewport',
        'Swap Viewport',
        'Swap Viewport',
        'Swap Viewport'
      ]
    };
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
