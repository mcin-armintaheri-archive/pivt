<template>
  <el-button type="primary" class="volume-info-button" @click="toggleVolumeInfo">
    Volume Information
  </el-button>
</template>

<script>

/**
 * The sidebar button for opening the volume information window.
 */
export default {
  name: 'volume-info-sidebar',
  props: ['controller'],
  methods: {
    toggleVolumeInfo() {
      this.controller.windowConfig.open = !this.controller.windowConfig.open;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
