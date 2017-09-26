<template>
  <el-button
    class="flip-ortho"
    type="primary"
    @click="camControls.flipCamera()"
  >
    Flip Camera Position
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
  props: ['controller', 'camControls'],
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flip-ortho {
  margin-top: 10px;
}
</style>
