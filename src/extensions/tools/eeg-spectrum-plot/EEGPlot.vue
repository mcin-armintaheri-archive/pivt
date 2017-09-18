<template>
  <div class="plot-container">
  </div>
</template>

<script>
export default {
  name: 'eeg-plot',
  props: ['controller'],
  mounted() {
    this.controller.initialize(this.$el);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
