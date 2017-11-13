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
      <el-col v-for="(o, i) in overlays">
        <div class="overlay-name-container">
          <div class="overlay-name">File Name: {{o.getName()}}</div>
          <el-button type="primary" @click="controller.getShaderManager().removeOverlay(i)">
            Remove
          </el-button>
        </div>
        <color-map
          v-bind:shaderColorMap="o.colorMapName"
          v-on:colormap-select="(m) => updateColorMap(i, m.name, m.texture)"
        >
        </color-map>
        <uniform-slider
          title="Weight: "
          v-bind:shaderValue="o.weight"
          maxValue="100"
          multiplier="100"
          v-on:value-change="w => updateWeight(i, w)"
        >
        </uniform-slider>
        <uniform-slider
          v-if="o.getMaxTime() > 1"
          title="Time Index: "
          v-bind:shaderValue="o.timeIndex"
          v-bind:maxValue="o.getMaxTime()"
          v-on:value-change="t => updateTimeIndex(i, t)"
        >
        </uniform-slider>
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
import UniformSlider from './UniformSlider';

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
    'color-map': ColorMap,
    'uniform-slider': UniformSlider
  },
  data() {
    return {
      showMaterialAdd: false,
      showLoading: false,
      overlays: this.controller.getShaderManager().getMRIs()
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
        this.controller.addMaterialFromBuffer(buffermanager.getBuffer(uid))
          .then(() => { this.showLoading = false; });
      }, 100); // Timeout for the ui to show loading modal.
    },
    updateColorMap(i, name, texture) {
      const shaderManager = this.controller.getShaderManager();
      shaderManager.setArrayUniform('colorMap', i, texture);
      shaderManager.setArrayUniform('enableColorMap', i, 1);
      shaderManager.getMRIs()[i].setColormapName(name);
    },
    updateWeight(i, w) {
      const shaderManager = this.controller.getShaderManager();
      shaderManager.setArrayUniform('weight', i, w);
      shaderManager.getMRIs()[i].setWeight(w);
    },
    updateTimeIndex(i, t) {
      const shaderManager = this.controller.getShaderManager();
      shaderManager.setArrayUniform('timeIndex', i, t);
      shaderManager.getMRIs()[i].setTimeIndex(t);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.overlay-name {
  align-items: center;
}
.overlay-name-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 40px;
  color: #fff;
}
.load-button {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
