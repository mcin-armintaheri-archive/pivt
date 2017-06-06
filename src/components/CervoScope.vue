<template>
  <div class="container">
    <sidebar></sidebar>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';

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
