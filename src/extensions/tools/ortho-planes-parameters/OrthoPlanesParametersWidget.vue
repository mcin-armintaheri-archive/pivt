<template>
  <div class="container">
    <div class="input-title">
      Position:
    </div>
    <div class="plane-inputs">
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="pos.x"
        @change="x => updatePlanePos({ x })"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="pos.y"
        @change="y => updatePlanePos({ y })"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="pos.z"
        @change="z => updatePlanePos({ z })"
      >
      </el-input-number>
      <el-button @click="updatePlanePos({ x: 0, y: 0, z: 0 })">R</el-button>
    </div>
    <br />
    <div class="input-title">
      Rotation (Degrees):
    </div>
    <div class="plane-inputs">
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="rot.x"
        @change="x => updatePlaneRot({ x })"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="rot.y"
        @change="y => updatePlaneRot({ y })"
      >
      </el-input-number>
      <el-input-number
        size="small"
        class="plane-number-component"
        v-model="rot.z"
        @change="z => updatePlaneRot({ z })"
      >
      </el-input-number>
      <el-button @click="resetPlaneRot">R</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ortho-planes-parameters-widget',
  props: ['controller'],
  mounted() {
    this.controller.onSceneUpdate((pos, rot) => {
      this.updatePlanePos({ x: pos.x, y: pos.y, z: pos.z });
      this.updatePlaneRot({ x: rot.x, y: rot.y, z: rot.z }, true);
    });
  },
  data() {
    return {
      pos: { x: 0, y: 0, z: 0 },
      rot: { x: 0, y: 0, z: 0 },
    };
  },
  methods: {
    updatePlanePos(newpos) {
      Object.assign(this.pos, newpos);
      const { x, y, z } = this.pos;
      this.controller.setPlanePos(x, y, z);
      const mul = a => Math.floor(a * 100) / 100;
      this.pos.x = mul(this.pos.x);
      this.pos.y = mul(this.pos.y);
      this.pos.z = mul(this.pos.z);
    },
    updatePlaneRot(newrot, rads = false) {
      Object.assign(this.rot, newrot);
      const { x, y, z } = this.rot;
      this.controller.setPlaneRot(x, y, z, rads);
      let mul;
      if (rads) {
        mul = a => Math.floor(a * 100 * (180 / Math.PI)) / 100;
      } else {
        mul = a => Math.floor(a * 100) / 100;
      }
      this.rot.x = mul(this.rot.x);
      this.rot.y = mul(this.rot.y);
      this.rot.z = mul(this.rot.z);
    },
    resetPlaneRot() {
      this.updatePlaneRot({ x: 0, y: 0, z: 0 });
      this.controller.rotationResetCallbacks.forEach(f => f());
    },
  },
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
</style>
