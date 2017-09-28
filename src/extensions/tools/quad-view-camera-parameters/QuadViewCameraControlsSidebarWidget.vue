<template>
    <el-button class="cam-controls-button" type="primary" @click="controller.openCamControls()">
      <icon name="video-camera"></icon> &nbsp; Open Camera Controls
    </el-button>
</template>

<script>

/**
 * The sidebar button for opening the controls window.
 */
export default {
  name: 'quad-view-camera-controls-sidebar-widget',
  props: ['controller'],
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
