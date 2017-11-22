import R from 'ramda';
import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './Shaders';

const compareVecs = comp => (a1, a2) => {
  if (a1.length !== a2.length) {
    throw new Error(`${a1} and ${a2} are not equal length`);
  }
  const out = [];
  a1.forEach((_, i) => { out[i] = comp(a1[i], a2[i]); });
  return out;
};

const ZERO_VEC_ARRAY = [0, 0, 0];
const DEFAULT_SHADER = `
  void main() {
    discard;
  }
`;

/**
* ShaderManager is used to manage the shaders used to sample an MRI volume and shade
* faces based on the sampled intensity at points in the volume.
* @param       {OrthoPlanes} scene
* @param       {Layout} layout
 * @param       {PlanesMaterialManager} materialManager
 * @constructor
 */
export default class ShaderManager {
  constructor() {
    this.material = new THREE.ShaderMaterial({
      fragmentShader: DEFAULT_SHADER
    });
    this.onResetCallbacks = [];
    this.box = new THREE.Box3();
    this.overlayMRIBuffers = [];
    this.uniforms = {
      trilinearInterpol: { type: 'b', value: false },
      contrastTexture: { type: 't', value: null },
      enableConstrast: { type: 'b', value: false },
      brightness: { type: 'f', value: -1.0 },
      // Overlay uniforms:
      worldMin: { type: '3fv', value: ZERO_VEC_ARRAY },
      worldMax: { type: '3fv', value: ZERO_VEC_ARRAY },
      w2v: { type: 'Matrix4fv', value: [] },
      swapMat: { type: 'Matrix3fv', value: [] },
      stride: { type: '3fv', value: [] },
      dimensions: { type: '3fv', value: [] },
      weight: { type: '1fv', value: [] },
      timeIndex: { type: '1fv', value: [] },
      timeStride: { type: '1fv', value: [] },
      nbTexturesUsed: { type: '1iv', value: [] },
      textureSize: { type: '2fv', value: [] },
      textures: { type: 'tv', value: [] },
      colorMap: { type: 'tv', value: [] },
      enableColorMap: { type: '1iv', value: [] },
      textureOffsets: { type: '1iv', value: [] }
    };
  }
  getMRIs() {
    return this.overlayMRIBuffers;
  }
  getDiagonal() {
    return this.diagonal;
  }
  getBoundingBox() {
    return this.box;
  }
  addOverlay(mriOverlay) {
    this.overlayMRIBuffers.push(mriOverlay);
    this.resetShader();
  }
  removeOverlay(index) {
    this.overlayMRIBuffers.splice(index, 1);
    this.resetShader();
  }
  resetShader() {
    // TODO: functional fancyness for setting uniforms.
    const bs = this.overlayMRIBuffers.map(b => b.getUniforms());
    this.uniforms.worldMin.value = bs.map(R.prop('worldMin')).reduce(
      compareVecs((x1, x2) => (x1 < x2 ? x1 : x2)),
      ZERO_VEC_ARRAY
    );
    this.uniforms.worldMax.value = bs.map(R.prop('worldMax')).reduce(
      compareVecs((x1, x2) => (x1 > x2 ? x1 : x2)),
      ZERO_VEC_ARRAY
    );
    const v1 = new THREE.Vector3().fromArray(this.uniforms.worldMin.value);
    const v2 = new THREE.Vector3().fromArray(this.uniforms.worldMax.value);
    this.diagonal = new THREE.Vector3().subVectors(v2, v1).length();
    this.box.copy(new THREE.Box3(v1, v2));
    if (bs.length === 0) {
      this.material.fragmentShader = DEFAULT_SHADER;
      this.material.needsUpdate = true;
      this.onResetCallbacks.forEach((f) => { f(); });
      return;
    }
    this.uniforms.w2v.value = R.flatten(bs.map(R.prop('w2v')));
    this.uniforms.swapMat.value = R.flatten(bs.map(R.prop('swapMat')));
    this.uniforms.stride.value = R.flatten(bs.map(R.prop('stride')));
    this.uniforms.dimensions.value = R.flatten(bs.map(R.prop('dimensions')));
    this.uniforms.weight.value = bs.map(R.prop('weight'));
    this.uniforms.timeIndex.value = bs.map(R.prop('timeIndex'));
    this.uniforms.timeStride.value = bs.map(R.prop('timeStride'));
    this.uniforms.nbTexturesUsed.value = bs.map(R.prop('nbTexturesUsed'));
    this.uniforms.textureSize.value = R.flatten(bs.map(R.prop('textureSize')));
    this.uniforms.textures.value = R.unnest(bs.map(R.prop('textures')));
    this.uniforms.colorMap.value = bs.map(R.prop('colorMap'));
    this.uniforms.enableColorMap.value = bs.map(R.prop('enableColorMap'));
    this.uniforms.textureOffsets.value = [];
    let offset = 0;
    for (let i = 0; i < this.uniforms.nbTexturesUsed.value.length; i += 1) {
      this.uniforms.textureOffsets.value[i] = offset;
      offset += this.uniforms.nbTexturesUsed.value[i];
    }
    // Generate texture Offsets:
    this.material.copy(new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: this.uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT(
        this.uniforms.textures.value.length,
        this.uniforms.textureOffsets.value.length
      )
    }));
    this.material.needsUpdate = true;
    this.onResetCallbacks.forEach((f) => { f(); });
  }
  onReset(callback) {
    if (callback instanceof Function) {
      this.onResetCallbacks.push(callback);
    }
  }
  shadePlane(plane) {
    if (this.material) {
      const planeSize = 2 * this.getDiagonal();
      /* eslint-disable no-param-reassign */
      plane.material = this.material;
      plane.geometry = new THREE.PlaneGeometry(planeSize, planeSize);
      plane.needsUpdate = true;
    }
  }
  setUniform(key, value) {
    const matUniform = R.path(['uniforms', key], this.material);
    if (matUniform) {
      matUniform.value = value;
    }
    if (this.uniforms[key]) {
      this.uniforms[key].value = value;
    } else {
      this.uniforms[key] = { value };
    }
  }
  setArrayUniform(key, index, value) {
    const matUniform = R.path(['uniforms', key], this.material);
    if (matUniform && (matUniform.value instanceof Array)) {
      matUniform.value[index] = value;
    }
    if (this.uniforms[key] && (this.uniforms[key].value instanceof Array)) {
      this.uniforms[key].value = R.adjust(
        R.always(value),
        index,
        this.uniforms[key].value
      );
      if (this.overlayMRIBuffers[index]) {
        this.overlayMRIBuffers[index].getUniforms()[key] = value;
      }
    }
  }
  getMaterial() {
    return this.material;
  }
}
