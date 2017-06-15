
<template>
  <div class="container">
    <el-button @click="showMaterialAdd = true" type="primary">
      <i class="el-icon-caret-top"></i>&nbsp;Load Volume Buffer
    </el-button>
    <el-dialog
      title="Select a volume buffer to view."
      :visible.sync="showMaterialAdd"
      size="small"
      :modal.boolean="false"
    >
      <buffer-manager-widget
        v-on:select-buffer="loadBuffer"
        v-bind:buffers="loadedBuffers"
      >
      </buffer-manager-widget>
      <span slot="footer">
        <el-button @click="showMaterialAdd = false">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Please wait! Loading the volume."
      :visible.sync="showLoading"
      size="tiny"
      :modal.boolean="false"
    >
    <h2><i class="el-icon-loading"></i> Loading</h2>
    </el-dialog>
  </div>
</template>

<script>
import BufferManager from '@/extensions/BufferManager';
import BufferManagerWidget from '@/components/BufferManagerWidget';

const buffermanager = BufferManager.getInstance();

export default {
  name: 'material-buffer-loader',
  props: ['controller'],
  components: {
    'buffer-manager-widget': BufferManagerWidget,
  },
  mounted() {
    buffermanager.onBufferLoad(() => {
      this.loadedBuffers = buffermanager.getBufferList();
    });
  },
  data() {
    return {
      showMaterialAdd: false,
      showLoading: false,
      loadedBuffers: buffermanager.getBufferList(),
    };
  },
  methods: {
    loadBuffer(uid) {
      this.showLoading = true;
      setTimeout(() => {
        this.controller.createTextureFromBuffer(
          buffermanager.getBuffer(uid).buffer,
          () => {
            this.showLoading = false;
            this.showMaterialAdd = false;
          },
        );
      }, 500);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
