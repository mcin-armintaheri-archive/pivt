<template>
  <div class="container">
  </div>
</template>

<script>
export default {
  name: 'perspective-controls',
  props: ['controller'],
  mounted() {
    this.controller.initialize(this.$el);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  background-color: #fff;
}
</style>
