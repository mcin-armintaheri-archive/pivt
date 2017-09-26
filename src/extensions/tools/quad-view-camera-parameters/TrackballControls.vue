<template>
  <el-button
    class="reset-trackball"
    type="primary"
    @click="controller.resetControls()"
  >
    Reset Orientation
  </el-button>
</template>

<script>
/**
 * perspective-controls contains a button to reset the orientation
 * of perspective camera.
 * @type {String}
 */
export default {
  name: 'trackball-controls',
  props: ['controller'],
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.reset-trackball {
  margin-top: 10px;
}
</style>
