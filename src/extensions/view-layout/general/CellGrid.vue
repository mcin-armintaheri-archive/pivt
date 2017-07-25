<template>
  <div class="container">
    <div v-for="i in colindices" class="layout-column">
      <div
        v-for="j in rowindices"
        class="layout-cell"
        :style="cellStyle"
        :key="`cell ${i} ${j}`"
      >
        <slot :name="`${i} ${j}`"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cell-layout',
  props: ['rows', 'columns', 'cellWidth', 'cellHeight', 'cellStyle'],
  computed: {
    rowindices() {
      return [...Array(Number(this.rows)).keys()];
    },
    colindices() {
      return [...Array(Number(this.columns)).keys()];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
.layout-column {
  display: flex;
  flex-direction: column;
}
</style>
