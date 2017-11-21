<template>
  <div class="container">
    <div>Mouse Position (World): {{xVal}}, {{yVal}}, {{zVal}}</div>
    <div>Line Distance: {{distance}} (mm)</div>
  </div>
</template>

<script>
/**
 * The sidebar button for opening the volume info window.
 */

function roundNearest(n, x) {
  return Math.round(n * x) / n;
}

export default {
  name: 'volume-info-window-content',
  props: ['controller'],
  computed: {
    xVal() {
      return roundNearest(100, this.controller.hoverPositionWorld.x);
    },
    yVal() {
      return roundNearest(100, this.controller.hoverPositionWorld.y);
    },
    zVal() {
      return roundNearest(100, this.controller.hoverPositionWorld.z);
    },
    distance() {
      return roundNearest(100, this.controller.segmentDistanceWorld);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px 20px;
  min-width: 300px;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                supported by Chrome and Opera */
}
</style>
