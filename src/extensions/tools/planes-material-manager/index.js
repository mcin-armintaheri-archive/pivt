import { Image3DGenericDecoderAlt } from 'pixpipejs';
import { MessageBox } from 'element-ui';

import ShaderManager from './ShaderManager';
import MRIOverlay from './MRIOverlay';

import MaterialBufferLoader from './MaterialBufferLoader';

import BufferManager from '../../BufferManager';

const bufferManager = BufferManager.getInstance();


/**
 * PlanesMaterialManager sets the material of the planes in the OrthoPlanes scene.
 * PlanesMaterialManager also offers a method for creating a shader that samples
 * an MNI volume loaded into the list of file buffers.
 */
export default class PlanesMaterialManager {
  constructor(view) {
    this.sidebarWidget = MaterialBufferLoader;
    this.scene = view.scene;
    this.materialChangeCallbacks = [];
    this.texturesCreatedCallbacks = [];
    this.shaderManager = new ShaderManager();
  }
  getMainVolumeTextures() {
    return this.volumeTextures;
  }
  getShaderManager() {
    return this.shaderManager;
  }
  setMainColorMap(colorMap) {
    this.shaderManager.setArrayUniform('colorMap', 0, colorMap);
    this.shaderManager.setArrayUniform('enableColorMap', 0, true);
  }
  /**
   * Using a buffer in the file buffer list, use pixpipe Image3DGenericDecoder
   * to decode the buffer and then use Image3DToMosaicFilter to convert the
   * Image3D into a mosiac. Use the mosiac to generate textures
   * which can be sampled in a webGL shader.
   * When the material is created call the materialChange handlers.
   * @param  {Object}   bufferMeta bufferMeta holding the volume data.
   */
  addMaterialFromBuffer(bufferMeta) {
    const { buffer, name, checksum } = bufferMeta;
    const decoder = new Image3DGenericDecoderAlt();
    return new Promise((resolve) => {
      decoder.addInput(buffer);
      decoder.update();
      if (decoder.getNumberOfOutputs() === 0) {
        MessageBox.alert(`Cannot decode ${name} into an Image3D .`, 'Decoding Error', {
          confirmButtonText: 'OK'
        });
        resolve(null);
        return;
      }
      const mriVolume = decoder.getOutput();
      if (!mriVolume) {
        MessageBox.alert(`Cannot decode ${name} into an Image3D.`, 'Decoding Error', {
          confirmButtonText: 'OK'
        });
        resolve(null);
        return;
      }
      this.shaderManager.addOverlay(new MRIOverlay(mriVolume));
      this.scene.setBoundingBox(this.shaderManager.getBoundingBox());
      this.scene.getPlanes().forEach((p) => { this.shaderManager.shadePlane(p); });
      this.materialChangeCallbacks.forEach((f) => {
        if (f instanceof Function) {
          f(this.shaderManager);
        }
      });
      this.bufferChecksum = checksum;
      resolve(this.shaderManager);
    });
  }
  onMaterialChange(callback) {
    if (callback instanceof Function) {
      this.materialChangeCallbacks.push(callback);
    }
  }
  serialize() {
    return { checksum: this.bufferChecksum };
  }
  deserialize(json) {
    const buffer = bufferManager.getByChecksum(json.checksum);
    if (buffer) {
      return this.setMaterialFromBuffer(buffer);
    }
    return Promise.resolve();
  }
}
