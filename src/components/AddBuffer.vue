<template>
  <input type="file" @change="addFile($event.target.files[0])"/>
</template>

<script>
import BufferManager from '@/extensions/BufferManager';

const buffermanager = BufferManager.getInstance();

export default {
  name: 'add-buffer',
  methods: {
    /**
     * When the file input changes, emit a vue-event containing the file
     * reference as payload.
     * @param {[FILE]} file The file reference taken from the input.
     */
    addFile(file) {
      // TODO: Kind of specific to add a volume for a general buffer adder.
      this.$emit('new-file-loading');
      buffermanager.loadBrainVolume(file, () => {
        this.$emit('new-file-added');
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
