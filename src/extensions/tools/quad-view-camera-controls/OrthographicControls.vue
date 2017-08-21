<template>
  <div class="container">
    <div class="input-title">
      {{ this.title }}
    </div>
    <div class="labeled-input">
      <div class="input-title">Roll:</div>
      <el-input-number
        size="small"
        v-model="roll"
      >
      </el-input-number>
    </div>
    <div class="roll-buttons">
      <el-button
        class="roll-rotator"
        type="primary"
        @click="camControls.rollBy(roll)"
      >
        Roll
      </el-button>
      <el-button
        class="roll-rotator"
        type="primary"
        @click="camControls.rollBy(-roll)"
      >
        Unroll
      </el-button>
    </div>
    <div class="labeled-input">
      <div class="input-title">X Pan:</div>
      <el-input-number
        size="small"
        v-model="inputPanX"
      >
      </el-input-number>
    </div>
    <div class="labeled-input">
      <div class="input-title">Y Pan:</div>
      <el-input-number
        size="small"
        v-model="inputPanY"
      >
      </el-input-number>
    </div>
  </div>
</template>

<script>
/**
 * orthographic-controls is a child component for containing the inputs
 * associated with a single orthographic layout. It offers
 * inputs for rolling, and panning the orthographic camera.
 */
export default {
  name: 'orthographic-controls',
  props: ['controller', 'title', 'camControls'],
  data() {
    return {
      roll: 0,
      viewportPan: this.camControls.getViewport().pan,
    };
  },
  computed: {
    inputPanX: {
      get() {
        return this.viewportPan.x;
      },
      set(x) {
        this.camControls.getViewport().setPan({ x });
      },
    },
    inputPanY: {
      get() {
        return this.viewportPan.y;
      },
      set(y) {
        this.camControls.getViewport().setPan({ y });
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  background-color: #555;
  padding-bottom: 20px;
}
.container .input-title {
  margin-bottom: 10px;
}
.roll-rotator {
  margin: 10px;
}
.roll-buttons {
  display: flex;
  flex-direction: row;
}
.labeled-input {
  margin: 1px 1px;
}
</style>
