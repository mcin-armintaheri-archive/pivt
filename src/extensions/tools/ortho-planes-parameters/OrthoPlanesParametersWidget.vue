<template>
  <div class="container">
    <div class="input-title">
      Position:
    </div>
    <div class="plane-inputs">
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="posX"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="posY"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="posZ"
      >
      </el-input-number>
      <el-button class="reset-button" @click="resetPlanePos()">
        <icon name="refresh"></icon>
      </el-button>
    </div>
    <br />
    <div class="input-title">
      Rotation (Degrees):
    </div>
    <div class="plane-inputs">
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="rotX"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="rotY"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="rotZ"
      >
      </el-input-number>
      <el-button class="reset-button" @click="resetPlaneRot">
        <icon name="refresh"></icon>
      </el-button>
    </div>
  </div>
</template>

<script>
function deg2Rad(angle) {
  return Math.PI * (angle / 180);
}

function rad2Deg(angle) {
  return 180 * (angle / Math.PI);
}
/**
 * ortho-planes-parameters-widget offers inputs for the user to
 * precisely orient the planes in an OrthoPlanes scene.
 * @type {String}
 */
export default {
  name: 'ortho-planes-parameters-widget',
  props: ['controller'],
  data() {
    return {
      pos: this.controller.getPlaneSystem().position,
      rot: this.controller.getPlaneSystem().rotation
    };
  },
  computed: {
    posX: {
      get() { return this.pos.x; },
      set(v) { this.pos.x = v; }
    },
    posY: {
      get() { return this.pos.y; },
      set(v) { this.pos.y = v; }
    },
    posZ: {
      get() { return this.pos.z; },
      set(v) { this.pos.z = v; }
    },
    rotX: {
      get() { return rad2Deg(this.rot.x); },
      set(v) { this.rot.x = deg2Rad(v); }
    },
    rotY: {
      get() { return rad2Deg(this.rot.y); },
      set(v) { this.rot.y = deg2Rad(v); }
    },
    rotZ: {
      get() { return rad2Deg(this.rot.z); },
      set(v) { this.rot.z = deg2Rad(v); }
    }
  },
  methods: {
    resetPlanePos() {
      this.posX = 0;
      this.posY = 0;
      this.posZ = 0;
      this.controller.rotationResetCallbacks.forEach(f => f());
    },
    resetPlaneRot() {
      this.rotX = 0;
      this.rotY = 0;
      this.rotZ = 0;
      this.controller.rotationResetCallbacks.forEach(f => f());
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plane-inputs {
  display: flex;
  justify-content: space-between;
}
.plane-number-component {
  width: 120px;
}
.reset-button {
  padding: 5px 10px;
}
</style>
