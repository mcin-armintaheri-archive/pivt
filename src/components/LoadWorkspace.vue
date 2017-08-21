<template>
  <input class="add-file-input" type="file" @change="addWorkspace($event.target.files[0])"/>
</template>

<script>
import ApplicationManager from '@/extensions/ApplicationManager';
import BufferManager from '@/extensions/BufferManager';

const appManager = ApplicationManager.getInstance();
const bufferManager = BufferManager.getInstance();

console.log(appManager, bufferManager);
export default {
  name: 'load-workspace',
  mounted() {
    const input = this.$el;
    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (String.fromCharCode(event.which).toLowerCase() === 'o') {
          input.click();
          event.preventDefault();
        }
      }
      return false;
    });
  },
  methods: {
    addWorkspace(file) {
      console.log(file);
      this.$el.value = '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add-file-input {
  display: none;
}
</style>
