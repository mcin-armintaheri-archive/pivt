
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
      <buffer-manager-widget v-on:select-buffer="loadBuffer">
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

const buffermanager = BufferManager.getInstance();

export default {
  name: 'material-buffer-loader',
  props: ['controller'],
  components: {
    'buffer-manager-widget': BufferManagerWidget,
  },
  data() {
    return {
      showMaterialAdd: false,
      showLoading: false,
    };
  },
  methods: {
    loadBuffer(uid) {
      this.showMaterialAdd = false;
      this.showLoading = true;
      setTimeout(() => {
        this.controller.createTextureFromBuffer(
          buffermanager.getBuffer(uid).buffer,
          () => {
            this.showLoading = false;
          },
        );
      }, 100);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>