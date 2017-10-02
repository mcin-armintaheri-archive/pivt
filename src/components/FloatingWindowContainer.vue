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

/**
 * Convert a tool's window config into screen space coordinates
 * for the initial openning position of a window.
 * @param  {[{x, y, viewportCoords}]} openPosition
 * @return {[{x, y}]} screen space coordinates of window.
 */
const initialOpenPosition = (openPosition) => {
  const pos = {};
  Object.assign(pos, openPosition);
  const { x, y, viewportCoords } = pos;
  if (viewportCoords) {
    return { x: x * window.innerWidth, y: y * window.innerHeight };
  }
  return { x, y };
};

/**
 * floating-window-container renders a windows topbar, bottombar and its
 * actual contents given by the associated tool. The running tool is
 * passed as a prop called 'window-controller'. Handlers are set up
 * to handle window dragging.
 */
export default {
  name: 'floating-window-container',
  components: {
    'floating-window-widget': FloatingWindowWidget
  },
  props: ['window-controller'],
  data() {
    return { windowPos: initialOpenPosition(this.windowController.windowConfig.openPosition) };
  },
  mounted() {
    let initialWindowPos;
    let mouseDownPos;
    let dragging = false;
    /**
     * Event handler for releasing the mouse button on the top bar.
     * Sets the dragging flag to flase and stops the event handler
     * for releasing the top bar.
     */
    const releaseWindow = () => {
      this.$emit('window-release');
      dragging = false;
      window.removeEventListener('mouseup', releaseWindow);
    };
    /**
     * Event handler for holding down the mouse button on the top bar.
     * Sets dragging flag to true and saves the current position of the window.
     * Starts an event listener for when the window is released to releaseWindow()
     */
    const grabWindow = () => {
      this.$emit('window-grab');
      const { top, left } = this.$el.getBoundingClientRect();
      dragging = true;
      initialWindowPos = { top, left };
      mouseDownPos = { x: event.clientX, y: event.clientY };
      window.addEventListener('mouseup', releaseWindow);
    };
    /**
     * When the mouse is moved, moveWindow checks the dragging flag and
     * displaces the window from how far the mouse was dragged from the
     * mouse down position.
     * @param  {[Event]} event
     */
    const moveWindow = (event) => {
      if (dragging) {
        event.stopPropagation();
        event.preventDefault();
        this.windowPos.x = initialWindowPos.left + (event.clientX - mouseDownPos.x);
        this.windowPos.y = initialWindowPos.top + (event.clientY - mouseDownPos.y);
      }
    };
    const focusWindow = () => {
      this.$emit('window-focus');
    };
    const topbar = this.$el.querySelector('.top-bar');
    topbar.addEventListener('mousedown', grabWindow);
    this.$el.addEventListener('mousedown', focusWindow);
    window.addEventListener('mousemove', moveWindow);
    this.windowHandlers = { topbar, releaseWindow, grabWindow, moveWindow, focusWindow };
  },
  destroyed() {
    const { topbar, releaseWindow, grabWindow, moveWindow, focusWindow } = this.windowHandlers;
    topbar.removeEventListener('mousedown', grabWindow);
    this.$el.removeEventListener('mousedown', focusWindow);
    window.removeEventListener('mousemove', moveWindow);
    window.removeEventListener('mouseup', releaseWindow);
  },
  methods: {
    closeWindow(event) {
      event.stopPropagation();
      this.windowController.windowConfig.open = false;
      this.windowPos = initialOpenPosition(this.windowController.windowConfig.openPosition);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  pointer-events: all;
  display: inline-block;
  position: absolute;
  z-index: 0;
}
.container.focused {
  z-index: 1;
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
