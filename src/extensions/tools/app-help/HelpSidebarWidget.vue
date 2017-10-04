<template>
  <el-button class="help-button" type="primary" @click="controller.toggleHelp()">
    <icon name="info-circle"></icon> &nbsp; Help
  </el-button>
</template>

<script>

/**
 * The sidebar button for opening the controls window.
 */
export default {
  name: 'help-sidebar-widget',
  props: ['controller']
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
