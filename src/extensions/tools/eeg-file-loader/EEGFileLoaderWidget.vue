<template>
  <div class="container">
    <el-button @click="showAdd = true" type="primary">
      <i class="el-icon-caret-top"></i>&nbsp;Load EEG Buffer
    </el-button>
    <el-dialog
      title="Select an EEG buffer to view."
      :visible.sync="showAdd"
      size="small"
      :modal.boolean="false"
    >
      <buffer-manager-widget v-on:select-buffer="loadBuffer">
      </buffer-manager-widget>
      <span slot="footer">
        <el-button @click="showAdd = false">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Please wait! Loading the EEG data."
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
import BufferManager from '@/extensions/BufferManager';
import BufferManagerWidget from '@/components/BufferManagerWidget';

const bufferManager = BufferManager.getInstance();

export default {
  name: 'eeg-file-loader-widget',
  components: {
    'buffer-manager-widget': BufferManagerWidget
  },
  props: ['controller'],
  data() {
    return {
      showAdd: false,
      showLoading: false
    };
  },
  methods: {
    loadBuffer(uid) {
      this.showLoading = true;
      setTimeout(() => {
        this.controller.loadEEGBuffer(bufferManager.getBuffer(uid), () => {
          this.showLoading = false;
        });
      }, 50);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
