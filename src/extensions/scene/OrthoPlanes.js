const THREE = require('three');

export default class OrthoPlanes {
  constructor() {
    this.scene = new THREE.Scene();
  }
  getTHREEScene() {
    return this.scene;
  }
}
