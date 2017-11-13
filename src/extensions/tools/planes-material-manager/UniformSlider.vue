<template>
  <div class="container">
    <label class="slider-title">{{title}}</label>
    <input
      type="range"
      class="slider"
      min="0" :max="maxValue"
      v-model="innerValue"
    >
    <input
      type="number"
      min="0" :max="maxValue"
      class="slider-value"
      v-model="innerValue"
    >
  </div>
</template>

<script>

/**
 * The sidebar button for opening the controls window.
 */
export default {
  name: 'uniform-slider',
  props: ['title', 'shaderValue', 'maxValue', 'multiplier'],
  beforeUpdate() {
    if (this.shaderValue && this.shaderValue !== this.innerValue) {
      this.innerValue = Math.round(this.shaderValue * (this.multiplier || 1));
    }
  },
  mounted() {
    this.$emit('value-change', this.shaderValue);
    this.innerValue = this.shaderValue * (this.multiplier || 1);
  },
  data() {
    return { innerValue: 0 };
  },
  watch: {
    innerValue() {
      this.$emit('value-change', this.innerValue / (this.multiplier || 1));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.slider-title {
  width: 90px;
  color: #fff;
}
.slider-value {
  width: 60px;
}
.slider {
  flex: 1;
  margin: 0 15px;
}
</style>
