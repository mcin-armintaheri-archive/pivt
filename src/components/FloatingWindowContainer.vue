<template>
  <div
    class="container"
    v-bind:style="`top: ${windowPos.y}px; left: ${windowPos.x}px`"
  >
    <div class="top-bar">
      <span class="window-title">{{windowController.windowConfig.title}}</span>
      <el-button class="close-button" type="danger" @click="closeWindow">
        <icon name="close"></icon>
      </el-button>
    </div>
    <floating-window-widget
      class="window-widget"
      v-bind:window-controller="windowController"
    >
    </floating-window-widget>
    <div class="bottom-bar">
    </div>
  </div>
</template>

<script>
import FloatingWindowWidget from '@/components/FloatingWindowWidget';

const initialOpenPosition = (openPosition) => {
  const pos = {};
  Object.assign(pos, openPosition);
  const { x, y, viewportCoords } = pos;
  if (viewportCoords) {
    return { x: x * window.innerWidth, y: y * window.innerHeight };
  }
  return { x, y };
};

/* eslint-disable no-use-before-define */
export default {
  name: 'floating-window-manager',
  components: {
    'floating-window-widget': FloatingWindowWidget,
  },
  props: ['window-controller'],
  data() {
    return { windowPos: initialOpenPosition(this.windowController.windowConfig.openPosition) };
  },
  mounted() {
    let initialWindowPos;
    let mouseDownPos;
    let dragging = false;
    const releaseWindow = () => {
      this.$emit('window-release');
      dragging = false;
      window.removeEventListener('mouseup', releaseWindow);
    };
    const grabWindow = () => {
      this.$emit('window-grab');
      const { top, left } = this.$el.getBoundingClientRect();
      dragging = true;
      initialWindowPos = { top, left };
      mouseDownPos = { x: event.clientX, y: event.clientY };
      window.addEventListener('mouseup', releaseWindow);
    };
    const moveWindow = (event) => {
      if (dragging) {
        event.stopPropagation();
        event.preventDefault();
        this.windowPos.x = initialWindowPos.left + (event.clientX - mouseDownPos.x);
        this.windowPos.y = initialWindowPos.top + (event.clientY - mouseDownPos.y);
      }
    };
    const topbar = this.$el.querySelector('.top-bar');
    topbar.addEventListener('mousedown', grabWindow);
    window.addEventListener('mousemove', moveWindow);
    this.windowHandlers = { topbar, releaseWindow, grabWindow, moveWindow };
  },
  destroyed() {
    const { topbar, releaseWindow, grabWindow, moveWindow } = this.windowHandlers;
    topbar.removeEventListener('mousedown', grabWindow);
    window.removeEventListener('mousemove', moveWindow);
    window.removeEventListener('mouseup', releaseWindow);
  },
  methods: {
    closeWindow(event) {
      event.stopPropagation();
      this.windowController.windowConfig.open = false;
      this.windowPos = initialOpenPosition(this.windowController.windowConfig.openPosition);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  pointer-events: all;
  display: inline-block;
  position: absolute;
}
.window-widget {
  position: relative;
}
.top-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #0099ff;
  min-height: 35px;
  cursor: pointer;
}
.close-button {
  padding: 3px 5px;
  margin-right: 10px;
}
.window-title {
  margin-left: 20px;
}
.bottom-bar {
  display: flex;
  flex-direction: row;
}
</style>
