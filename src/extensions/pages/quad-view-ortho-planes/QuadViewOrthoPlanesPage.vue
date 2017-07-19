<template>
  <three-view class="three-mount" :controller="controller" name="view">
  </three-view>
</template>

<script>
import ThreeView from '@/components/ThreeView';

/**
 * curve-tool-widget renders the CanvasSpliner's DOM element
 * and allows the user to change the type of the spline.
 */
export default {
  name: 'quad-view-ortho-planes-page',
  components: {
    'three-view': ThreeView,
  },
  props: ['controller'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.three-mount{
  width: 100vw;
  height: 100vh;
}
</style>
