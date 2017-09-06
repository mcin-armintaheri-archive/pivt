<template>
  <div>
    <input class="add-file-input" type="file" @change="addWorkspace($event.target.files[0])"/>
    <el-dialog
      title="Please wait! Loading the workspace."
      class="show-loading"
      :visible.sync="showLoading"
      size="tiny"
      :modal.boolean="false"
      :show-close.boolean="false"
      :close-on-press-escape.boolean="false"
      :close-on-click-modal.boolean="false"
    >
      <h2><icon name="spinner" spin></icon> Loading</h2>
    </el-dialog>
  </div>
</template>

<script>
import { PixBinDecoder } from 'pixbincodec';
import ApplicationManager from '@/extensions/ApplicationManager';
import BufferManager from '@/extensions/BufferManager';

const appManager = ApplicationManager.getInstance();
const bufferManager = BufferManager.getInstance();

/* eslint-disable no-underscore-dangle */

export default {
  name: 'load-workspace',
  mounted() {
    const input = this.$el.querySelector('.add-file-input');
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
  data() {
    return { showLoading: false };
  },
  methods: {
    addWorkspace(file) {
      this.$el.value = '';
      const reader = new FileReader();
      const decoder = new PixBinDecoder();
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        decoder.setInput(event.target.result);
        const nblocks = decoder.getNumberOfBlocks();
        const data = {};

        // TODO: Load application metadata but splice buffers before reading them.
        for (let i = 0; i < nblocks; i += 1) {
          const block = decoder.fetchBlock(i);
          switch (block._metadata.type) {
            case 'buffers': {
              data.buffers = block;
              break;
            }
            case 'applications': {
              data.applications = block;
              break;
            }
            default: {
              break;
            }
          }
        }
        bufferManager.deserialize(data.buffers);
        this.showLoading = true;
        setTimeout(() => {
          const appProms = data.applications._data.map((appJSON) => {
            const appType = ApplicationManager.APPLICATION_TYPES
              .find(a => a.type === appJSON.type);
            if (!appType) {
              throw new Error(`${appJSON.type} is not a defined application type.`);
            }
            const { app, creationPromise } = appManager.loadApplication(appType);
            return creationPromise.then(() => app.deserialize(appJSON));
          });
          Promise.all(appProms).then(() => {
            this.showLoading = false;
            this.$message({
              type: 'success',
              message: 'Successfully loaded workspace!',
            });
          });
        }, 100);
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.show-loading {
  z-index: 4;
}
.add-file-input {
  display: none;
}
</style>
