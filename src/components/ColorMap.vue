<template>
  <div class="container">
    <canvas class="color-map" ref="colorMap"></canvas>
    <el-dropdown @command="setColorMap" trigger="click">
      <el-button type="primary">
        Color Map: {{ colorMap }}<i class="el-icon-caret-bottom el-icon--right"></i>
      </el-button>
      <el-dropdown-menu class="dropdown-list" slot="dropdown">
        <el-dropdown-item
          v-for="style in availableStyles"
          :key="style"
          :command="style"
        >
          {{ style }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import * as THREE from 'three';
import { Colormap, CanvasImageWriter } from 'pixpipejs';

/**
 * curve-tool-widget renders the CanvasSpliner's DOM element
 * and allows the user to change the type of the spline.
 */
export default {
  name: 'colormap',
  mounted() {
    // TODO: get rid of this by-id abomination in pixpipe
    this.imageWriter.setMetadata('parentDivID', 'color-map-div');
    this.setColorMap('greys');
  },
  data() {
    return {
      availableStyles: Colormap.getAvailableStyles(),
      colorMap: null,
      colorMapper: new Colormap(),
      imageWriter: new CanvasImageWriter()
    };
  },
  methods: {
    setColorMap(map) {
      const CANVAS_WIDTH = 200;
      const CANVAS_HEIGHT = 40;
      this.colorMap = map;
      this.colorMapper.setStyle(map);
      this.colorMapper.buildLut(CANVAS_WIDTH);
      const cmap = this.colorMapper.createHorizontalLutImage(false).getData();
      const cmaptex = new THREE.DataTexture(
        new Uint8Array(cmap),
        cmap.length / 3,
        1,
        THREE.RGBFormat
      );
      cmaptex.needsUpdate = true;
      this.$emit('colormap-select', cmaptex);
      const canvas = this.$refs.colorMap;
      const ctx = canvas.getContext('2d');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const cmapidx = 3 * ((i / 4) % CANVAS_WIDTH);
        imageData.data[i] = cmap[cmapidx];
        imageData.data[i + 1] = cmap[cmapidx + 1];
        imageData.data[i + 2] = cmap[cmapidx + 2];
        imageData.data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dropdown-list {
  height: 200px;
  overflow-y: scroll;
}
</style>
