<template>
  <div class="container">
    <el-button class="cam-controls-button" type="primary" @click="controller.openCamControls()">
      <icon name="video-camera"></icon> &nbsp; Open Camera Controls
    </el-button>
    <el-button class="cam-controls-reset-button" type="primary" @click="controller.resetControls()">
      <icon name="refresh"></icon> &nbsp; Reset Camera Controls
    </el-button>
  </div>
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
.container {
  display: flex;
  flex-direction: column;
}
.el-button {
  margin: 10px 30px;
}
</style>
