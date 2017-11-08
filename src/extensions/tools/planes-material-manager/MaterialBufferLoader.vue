<template>
  <div class="container">
    <el-row>
      <el-col>
        <el-button class="load-button" @click="showMaterialAdd = true" type="primary">
          <i class="el-icon-caret-top"></i>&nbsp;Add MRI File
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="(o, i) in controller.getShaderManager().getMRIs()">
        <color-map v-on:colormap-select="m => updateColorMap(i, m)"></color-map>
        <div class="voxel-mixer">
          <label class="voxel-mixer-title">Weight: </label>
          <input
            type="range"
            class="voxel-mixer-slider"
            v-model="voxelMix[i]"
          >
          <input
            type="number"
            min="0" max="100"
            class="voxel-mixer-value"
            v-model="voxelMix[i]"
          >
        </div>
      </el-col>
    </el-row>
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
      voxelMix: []
    };
  },
  beforeUpdate() {
    this.controller.getShaderManager().getMRIs().forEach((_, i) => {
      if (isNaN(this.voxelMix[i])) {
        this.voxelMix[i] = 100;
      }
    });
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
        this.controller.addMaterialFromBuffer(buffermanager.getBuffer(uid))
          .then(() => { this.showLoading = false; });
      }, 100); // Timeout for the ui to show loading modal.
    },
    updateColorMap(i, map) {
      this.controller.getShaderManager().setArrayUniform('colorMap', i, map);
      this.controller.getShaderManager().setArrayUniform('enableColorMap', i, 1);
    }
  },
  watch: {
    voxelMix(v) {
      const weights = v.map(x => Number(x) / 100);
      this.controller.getShaderManager().setUniform('weight', weights);
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
  margin-bottom: 10px;
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
