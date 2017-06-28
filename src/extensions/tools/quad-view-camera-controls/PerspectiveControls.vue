<template>
  <div class="container">
    <div class="input-title">
      {{ this.title }}
    </div>
    <div class="camera-inputs">
      <el-button
        type="primary"
        @click="controller.resetTrackball()"
      >
        Reset Orientation
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'perspective-controls',
  props: ['controller', 'title'],
  data() {
    return {};
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
  background-color: #777;
}
.container .input-title {
  margin-bottom: 10px;
}
</style>
