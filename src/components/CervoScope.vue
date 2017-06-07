<template>
  <div class="container">
    <sidebar v-bind:sidebar-widgets="sidebarWidgets"></sidebar>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import CurveTool from '@/extensions/tools/curve-tool';

const curvetool = new CurveTool();

export default {
  name: 'cervo-scope',
  components: {
//    windows: Windows,
    sidebar: SideBar,
//   viewer: Viewer,
  },
  data() {
    return {};
  },
  computed: {
    sidebarWidgets() {
      return [curvetool];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}
</style>
