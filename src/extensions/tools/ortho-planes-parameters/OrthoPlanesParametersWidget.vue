
<template>
  <div class="container">
    <div class="plane-input-title">
      Position:
    </div>
    <div class="plane-inputs">
      <el-input-number
        class="plane-number-component"
        v-model="pos.x"
        @change="x => updatePlanePos({ x })"
      >
      </el-input-number>
      <el-input-number
        class="plane-number-component"
        v-model="pos.y"
        @change="y => updatePlanePos({ y })"
      >
      </el-input-number>
      <el-input-number
        class="plane-number-component"
        v-model="pos.z"
        @change="z => updatePlanePos({ z })"
      >
      </el-input-number>
      <el-button @click="updatePlanePos({ x: 0, y: 0, z: 0 })">R</el-button>
    </div>
    <br />
    <div class="plane-input-title">
      Rotation:
    </div>
    <div class="plane-inputs">
      <el-input-number
        class="plane-number-component"
        v-model="rot.x"
        @change="x => updatePlaneRot({ x })"
      >
      </el-input-number>
      <el-input-number
        class="plane-number-component"
        v-model="rot.y"
        @change="y => updatePlaneRot({ y })"
      >
      </el-input-number>
      <el-input-number
        class="plane-number-component"
        v-model="rot.z"
        @change="z => updatePlaneRot({ z })"
      >
      </el-input-number>
      <el-button @click="updatePlaneRot({ x: 0, y: 0, z: 0 })">R</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ortho-planes-parameters-widget',
  props: ['controller'],
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
    },
    updatePlaneRot(newrot) {
      Object.assign(this.rot, newrot);
      const { x, y, z } = this.rot;
      this.controller.setPlaneRot(x, y, z);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plane-input-title {
  color: #ccc;
}
.plane-inputs {
  display: flex;
  justify-content: space-between;
}
.plane-number-component {
  width: 110px;
}
</style>
