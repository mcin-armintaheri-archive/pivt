<template>
  <div class="vue-component-view">
    <div
      v-for="app in applications"
      v-if="app.isRunning && app.layout && app.layout.layoutComponent"
    >
      <layout-component :layout-controller="app.layout">
      </layout-component>
    </div>
  </div>
</template>

<script>
import LayoutComponent from '@/components/LayoutComponent';

export default {
  name: 'vue-component-view',
  components: {
    'layout-component': LayoutComponent,
  },
  props: ['applications'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: absolute;
  z-index: 1;
}
</style>
