<template>
  <eeg-cells
    class="eeg-cell-mount"
    :controller="controller.getFrequencyController()"
  >
  </eeg-cells>
</template>

<script>
import EEGCells from './EEGCells';
/**
 * eeg-viewer is the main page for the EEGViewer application.
 */
export default {
  name: 'eeg-viewer',
  components: {
    'eeg-cells': EEGCells
  },
  props: ['controller']
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.eeg-cell-mount {
  margin-left: 20vw;
  margin-top: 10vh;
}
</style>
