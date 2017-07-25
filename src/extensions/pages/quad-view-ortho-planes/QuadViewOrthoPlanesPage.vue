<template>
  <three-view class="quad-view-mount" :controller="controller" name="view">
  </three-view>
</template>

<script>
import ThreeView from '@/components/ThreeView';

/**
 * quad-view-ortho-planes-page is the main page for the BrainSlicer application.
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
.quad-view-mount {
  width: 100vw;
  height: 100vh;
}
</style>
