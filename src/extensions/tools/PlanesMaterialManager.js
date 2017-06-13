const THREE = require('three');

export default class PlanesMaterialManager {
  constructor(scene) {
    this.scene = scene;
    this.materialChangeCallbacks = [];
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
        f(material, dimensions);
      }
    });
  }
  onMaterialChange(callback) {
    this.materialChangeCallbacks.push(callback);
  }
}
