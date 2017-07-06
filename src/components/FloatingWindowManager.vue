<template>
  <div id="floating-windows" v-bind:class="dragging ? 'dragging-mode' : ''">
    <div
      class="floating-window-layer"
      v-for="application in applications"
      v-bind:key="application.getUid()"
      v-if="application.isRunning"
      v-bind:window-controller="application"
    >
      <floating-window-container
        v-for="(tool, idx) in application.getTools()"
        v-bind:key="application.getUid() + '-' + idx"
        v-if="tool.windowConfig && tool.windowConfig.widget && tool.windowConfig.open"
        v-bind:window-controller="tool"
        v-on:window-grab="dragging = true"
        v-on:window-release="dragging = false"
        v-bind:class="dragging ? 'dragging-mode' : ''"
      >
      </floating-window-container>
    </div>
  </div>
</template>

<script>
import FloatingWindowContainer from '@/components/FloatingWindowContainer';

export default {
  name: 'floating-window-manager',
  components: {
    'floating-window-container': FloatingWindowContainer,
  },
  props: ['applications'],
  data() {
    return { dragging: false };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#floating-windows {
  pointer-events: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
 #floating-windows .floating-window-layer {
  pointer-events: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
}
#floating-windows.dragging-mode {
  pointer-events: all;
}
#floating-windows .floating-window-layer.dragging-mode {
  pointer-events: all;
}
</style>
