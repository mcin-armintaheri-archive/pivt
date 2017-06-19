import {
  Image3DToMosaicFilter,
} from 'pixpipejs';
import { MessageBox } from 'element-ui';

import MaterialBufferLoader from './MaterialBufferLoader';

const THREE = require('three');

/* eslint-disable no-alert */
export default class PlanesMaterialManager {
  constructor(scene) {
    this.sidebarWidget = MaterialBufferLoader;
    this.scene = scene;
    this.materialChangeCallbacks = [];
    this.texturesCreatedCallbacks = [];
    this.volumeTextures = [];
  }
  getCurrentVolumeTextures() {
    return this.volumeTextures;
  }
  getDimensions() {
    if (this.dimensions) {
      return this.dimensions;
    }
    return { x: 1.0, y: 1.0, z: 1.0, diagonal: Math.sqrt(3) };
  }
  getPlaneMaterial() {
    return this.scene.planeMaterial;
  }
  setShaderMaterial(material, dimensions) {
    this.dimensions = dimensions;
    const planeSize = 2 * dimensions.diagonal;
    this.scene.planeMaterial = material.clone();
    this.scene.planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    this.scene.initializePlanes();
    this.materialChangeCallbacks.forEach((f) => {
      if (f instanceof Function) {
        f(this.scene.planeMaterial, dimensions);
      }
    });
  }
  createTextureFromBuffer(buffer, callback) {
    const mosaicFilter = new Image3DToMosaicFilter();
    // genericDecoder ouputs a pixpipe.MniVolume, which iherit pixpipe.Image3D
    // making it compatible with pixpipe.Image3DToMosaicFilter
    mosaicFilter.addInput(buffer);
    // which axis do we want the picture of?
    const space = 'zspace';
    mosaicFilter.setMetadata('axis', space);

    // if time series, take it all
    mosaicFilter.setMetadata('time', -1);
    // run the filter
    mosaicFilter.update();
    if (!mosaicFilter.getNumberOfOutputs()) {
      MessageBox.alert('Could not turn decoded buffer into mosiac textures.', 'Texture Error', {
        confirmButtonText: 'OK',
      });
      callback();
      return;
    }
    // display the output in multiple canvas if needed
    this.volumeTextures = [];
    for (let nbOut = 0; nbOut < mosaicFilter.getNumberOfOutputs(); nbOut += 1) {
      const outputMosaic = mosaicFilter.getOutput(nbOut);
      outputMosaic.setMetadata('min', buffer.getMetadata('voxel_min'));
      outputMosaic.setMetadata('max', buffer.getMetadata('voxel_max'));
      const data = outputMosaic.getDataAsUInt8Array();
      const texture = new THREE.DataTexture(
        data,
        outputMosaic.getWidth(),
        outputMosaic.getHeight(),
        THREE.LuminanceFormat,
        THREE.UnsignedByteType,
      );
      texture.needsUpdate = true;
      this.volumeTextures.push(texture);
    }
    const sliceMatrixSize = {};
    sliceMatrixSize.x = mosaicFilter.getMetadata('gridWidth');
    sliceMatrixSize.y = mosaicFilter.getMetadata('gridHeight');
    this.dimensions = {};
    this.dimensions.x = buffer.getMetadata('xspace').space_length;
    this.dimensions.y = buffer.getMetadata('yspace').space_length;
    this.dimensions.z = buffer.getMetadata('zspace').space_length;
    this.dimensions.t = buffer.getTimeLength();
    const { x, y, z } = this.dimensions;
    this.dimensions.diagonal = Math.sqrt((x * x) + (y * y) + (z * z));
    this.texturesCreatedCallbacks.forEach((f) => {
      f(this.dimensions, sliceMatrixSize, this.volumeTextures);
    });
    callback();
  }
  onTexturesCreated(callback) {
    if (callback instanceof Function) {
      this.texturesCreatedCallbacks.push(callback);
    }
  }
  onMaterialChange(callback) {
    if (callback instanceof Function) {
      this.materialChangeCallbacks.push(callback);
    }
  }
}
