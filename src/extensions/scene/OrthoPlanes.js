import * as THREE from 'three';

/**
 * OrthoPlanes gives an API for modifying a threejs Scene containing 3 orthogonal
 * planes.
 */
export default class OrthoPlanes {
  constructor() {
    this.scene = new THREE.Scene();
    this.camSystem = new THREE.Object3D();
    this.planeSystem = new THREE.Object3D();
    this.planeSystem.add(this.camSystem);
    this.scene.add(this.camSystem);
    this.scene.add(this.planeSystem);
    this.planes = [];
    this.boundingBox = null;
    this.planesAreLoaded = false;
    this.planesInitCallbacks = [];
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
  getBoundingBox() {
    return this.boundingBox;
  }
  setBoundingBox(boundingBox) {
    this.boundingBox = boundingBox;
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
  onPlanesInitialized(f) {
    this.planesInitCallbacks.push(f);
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
    this.planesAreLoaded = true;
    this.planesInitCallbacks.forEach((f) => { f(this.planeSystem, this.planes); });
  }
  update() {
    if (!this.planesAreLoaded) {
      return;
    }
    if (this.boundingBox) {
      this.boundingBox.clampPoint(this.planeSystem.position, this.planeSystem.position);
    }
  }
}
