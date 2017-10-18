<template>
  <div class="container">
    <el-row>
      <el-col>
        <el-button class="load-button" @click="showMaterialAdd = true" type="primary">
          <i class="el-icon-caret-top"></i>&nbsp;Load Main MRI File
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <color-map v-on:colormap-select="m => controller.setMainColorMap(m)"></color-map>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button class="load-button" @click="showMaterialAdd = true" type="primary">
          <i class="el-icon-caret-top"></i>&nbsp;Load Overlay MRI File
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <color-map v-on:colormap-select="m => controller.setOverlayColorMap(m)"></color-map>
      </el-col>
    </el-row>
    <div class="voxel-mixer">
      <label class="voxel-mixer-title">Mixer: </label>
      <input type="range" class="voxel-mixer-slider" v-model="voxelMix">
      <input type="number" min="0" max="100" class="voxel-mixer-value" v-model="voxelMix">
    </div>
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
import ColorMap from '@/components/ColorMap';
import BufferManager from '@/extensions/BufferManager';
import BufferManagerWidget from '@/components/BufferManagerWidget';

const buffermanager = BufferManager.getInstance();

/**
 * material-buffer-loader opens a modal for a user to select a file buffer
 * and decode it mosiacs to convert into three textures.
 */
export default {
  name: 'material-buffer-loader',
  props: ['controller'],
  components: {
    'buffer-manager-widget': BufferManagerWidget,
    'color-map': ColorMap
  },
  data() {
    return {
      showMaterialAdd: false,
      showLoading: false,
      voxelMix: 0
    };
  },
  methods: {
    /**
     * When a file is selected, create the textures out of the buffer associated
     * the the buffer uid.
     * @param  {String} uid buffer's uid
     */
    loadBuffer(uid) {
      this.showMaterialAdd = false;
      this.showLoading = true;
      setTimeout(() => {
        this.controller.createTextureFromBuffer(buffermanager.getBuffer(uid))
          .then(() => { this.showLoading = false; });
      }, 100); // Timeout for the ui to show loading modal.
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.voxel-mixer {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  width: 350px;
}
.voxel-mixer-title {
  color: #fff;
}
.voxel-mixer-slider {
  margin-left: 30px;
  margin-right: 30px;
  width: 100%;
}
.voxel-mixer-value {
  width: 40px;
}

.load-button {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
