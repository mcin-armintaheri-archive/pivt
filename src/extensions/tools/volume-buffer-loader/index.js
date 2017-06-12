import {
  FileToArrayBufferReader,
  Image3DGenericDecoder,
  Image3DToMosaicFilter,
} from 'pixpipejs';

const THREE = require('three');

const loadBrainBufferFile = (file, callback) => {
  const file2Buff = new FileToArrayBufferReader();
  file2Buff.addInput(file);
  file2Buff.update();
  file2Buff.on('ready', function fileBufferIsReady() {
    const buff = this.getOutput();
    const decoder = new Image3DGenericDecoder();
    decoder.addInput(buff);
    decoder.update();
    /* eslint-disable no-alert */
    if (!decoder.getNumberOfOutputs()) {
      alert('Cannot open the uploaded file.');
      return;
    }
    const mniVol = decoder.getOutput();
    if (!mniVol) {
      alert('Cannot decode uploaded file.');
      return;
    }
    callback(mniVol);
  });
};

const buildShader = (loader, event) => {
  const file = event.target.files[0];
  loadBrainBufferFile(file, (mniVolume) => {
    const mosaicFilter = new Image3DToMosaicFilter();
    // genericDecoder ouputs a pixpipe.MniVolume, which iherit pixpipe.Image3D
    // making it compatible with pixpipe.Image3DToMosaicFilter
    mosaicFilter.addInput(mniVolume);
    // which axis do we want the picture of?
    const space = 'zspace';
    mosaicFilter.setMetadata('axis', space);

    // if time series, take it all
    mosaicFilter.setMetadata('time', -1);
    // run the filter
    mosaicFilter.update();
    if (!mosaicFilter.getNumberOfOutputs()) {
      alert('No output for mosaicFilter.');
      return;
    }
    // display the output in multiple canvas if needed
    const textures = [];
    for (let nbOut = 0; nbOut < mosaicFilter.getNumberOfOutputs(); nbOut += 1) {
      const outputMosaic = mosaicFilter.getOutput(nbOut);
      outputMosaic.setMetadata('min', mniVolume.getMetadata('voxel_min'));
      outputMosaic.setMetadata('max', mniVolume.getMetadata('voxel_max'));
      const data = outputMosaic.getDataAsUInt8Array();
      const texture = new THREE.DataTexture(
        data,
        outputMosaic.getWidth(),
        outputMosaic.getHeight(),
        THREE.LuminanceFormat,
        THREE.UnsignedByteType,
      );
      texture.needsUpdate = true;
      textures.push(texture);
    }
    const sliceMatrixSize = {};
    sliceMatrixSize.x = mosaicFilter.getMetadata('gridWidth');
    sliceMatrixSize.y = mosaicFilter.getMetadata('gridHeight');
    const dimensions = {};
    dimensions.x = mniVolume.getMetadata('xspace').space_length;
    dimensions.y = mniVolume.getMetadata('yspace').space_length;
    dimensions.z = mniVolume.getMetadata('zspace').space_length;
    dimensions.t = mniVolume.getTimeLength();
    const { x, y, z } = dimensions;
    dimensions.diagonal = Math.sqrt((x * x) + (y * y) + (z * z));
    if (loader.fileLoadCallback instanceof Function) {
      loader.fileLoadCallback(dimensions, sliceMatrixSize, textures);
    }
  });
};

export default class VolumeBufferLoader {
  constructor() {
    const loader = this;
    this.sidebarWidget = {
      name: 'volume-buffer-loader',
      template: '<input type="file" v-on:change="fileChanged">',
      methods: {
        fileChanged(event) {
          buildShader(loader, event);
        },
      },
    };
  }
  onFileLoad(callback) {
    this.fileLoadCallback = callback;
  }
}
