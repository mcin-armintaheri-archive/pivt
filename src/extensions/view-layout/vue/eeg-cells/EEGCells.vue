<template>
  <div class="container">
    <cell-grid
      class="cells"
      :rows="controller.layout.rows"
      :columns="controller.layout.cols"
      cell-style="width: 150px; height: 150px; padding: 5px 5px"
    >
      <tool-component
        v-for="cell in controller.layout.matrix"
        :controller="cell.controller"
        :key="`${cell.j} ${cell.i}`"
        :slot="`${cell.j} ${cell.i}`"
      >
      </tool-component>
    </cell-grid>
  </div>
</template>

<script>
import CellGrid from '../general/CellGrid';
import ToolComponent from '../general/ToolComponent';

export default {
  name: 'eeg-cells',
  components: {
    'cell-grid': CellGrid,
    'tool-component': ToolComponent,
  },
  props: ['controller'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  left: 30vw;
  margin-right: 30vw;
  top: 10vh;
}
</style>
