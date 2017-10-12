import * as THREE from 'three';

const ZERO = new THREE.Vector3(0, 0, 0);

export default class ScreenScene {
  constructor(size = 0.5) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-size, size, size, -size, 0.1, 20000);
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(ZERO);
  }
  getTHREEScene() {
    return this.scene;
  }
  renderWith(renderer) {
    renderer.render(this.scene, this.camera);
  }
}
