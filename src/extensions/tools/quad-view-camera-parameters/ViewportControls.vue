<template>
  <div class="container">
    <div class="input-title">
      {{ this.camControls.getTitle() }}
    </div>
    <div class="input-group">
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
      <el-button
        class="pan-reset"
        type="primary"
        @click="resetPan"
      >
        <icon name="refresh"></icon>
      </el-button>
    </div>
    <div class="input-group">
      <div class="labeled-input">
        <div class="input-title">Roll:</div>
        <el-input-number
          size="small"
          v-model="roll"
        >
        </el-input-number>
      </div>
      <el-button type="primary" @click="camControls.rollBy(roll)">
        Add
      </el-button>
      <el-button type="primary" @click="camControls.rollBy(-roll)">
        Decrease
      </el-button>
    </div>
    <div class="input-group">
      <el-button
        type="primary"
        @click="$emit('swap-viewport', camControls)"
      >
        {{ this.swapMode }}
      </el-button>
    </div>
    <trackball-controls
      v-if="camControls.getViewport().getType() === 'PERSPECTIVE'"
      v-bind:controller="controller"
    >
    </trackball-controls>
    <ortho-controls
      v-if="camControls.getViewport().getType() === 'ORTHOGRAPHIC'"
      v-bind:controller="controller"
      v-bind:camControls="camControls"
    >
    </ortho-controls>
  </div>
</template>

<script>
import TrackballControls from './TrackballControls';
import OrthoControls from './OrthoControls';

/**
 * orthographic-controls is a child component for containing the inputs
 * associated with a single orthographic layout. It offers
 * inputs for rolling, and panning the orthographic camera.
 */
export default {
  name: 'viewport-controls',
  props: ['controller', 'camControls', 'swapMode'],
  components: {
    'trackball-controls': TrackballControls,
    'ortho-controls': OrthoControls
  },
  beforeUpdate() {
    const vp = this.camControls.getViewport();
    if (vp !== this.viewport) {
      this.viewportPan = vp.pan;
    }
  },
  data() {
    return {
      roll: 0,
      viewport: this.camControls.getViewport(),
      viewportPan: this.camControls.getViewport().pan
    };
  },
  computed: {
    inputPanX: {
      get() {
        return this.viewportPan.x;
      },
      set(x) {
        this.camControls.getViewport().setPan({ x });
      }
    },
    inputPanY: {
      get() {
        return this.viewportPan.y;
      },
      set(y) {
        this.camControls.getViewport().setPan({ y });
      }
    }
  },
  methods: {
    resetPan() {
      this.inputPanX = 0;
      this.inputPanY = 0;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px;
  border-style: solid;
  border-color: #000;
  border-width: 1px;
}
.input-group {
  display: flex;
  flex-direction: row;
}
.input-group .el-button {
  height: 50%;
  margin: 0px 5px;
  margin-top: 30px;
}
.container .input-title {
  margin: 8px 0;
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
