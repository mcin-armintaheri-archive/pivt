const THREE = require('three');

export default class OrthoPlanes {
  constructor() {
    this.scene = new THREE.Scene();
    this.camSystem = new THREE.Object3D();
    this.planeSystem = new THREE.Object3D();
    this.planeSystem.add(this.camSystem);
    this.scene.add(this.camSystem);
    this.scene.add(this.planeSystem);
    this.planes = [];
  }
  getTHREEScene() {
    return this.scene;
  }
  getCameraSystem() {
    return this.camSystem;
  }
  getPlaneSystem() {
    return this.planeSystem;
  }
  getPlanes() {
    return this.planes;
  }
  getXY() {
    return this.planeXY;
  }
  getXZ() {
    return this.planeXZ;
  }
  getYZ() {
    return this.planeYZ;
  }
  initializePlanes() {
    this.planeXY = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.planeXZ = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.planeYZ = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.planeXZ.rotation.x = Math.PI / 2.0;
    this.planeYZ.rotation.y = Math.PI / 2.0;
    this.planes.forEach((plane) => {
      this.planeSystem.remove(plane);
    });
    this.planes = [this.planeXY, this.planeXZ, this.planeYZ];
    this.planes.forEach((plane) => {
      this.planeSystem.add(plane);
    });
  }
}
