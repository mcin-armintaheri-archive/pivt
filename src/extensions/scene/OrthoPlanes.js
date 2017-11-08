import * as THREE from 'three';

/**
 * OrthoPlanes gives an API for modifying a threejs Scene containing 3 orthogonal
 * planes.
 */
export default class OrthoPlanes {
  constructor() {
    this.scene = new THREE.Scene();
    this.planeSystem = new THREE.Object3D();
    this.boundingBox = null;
    const geom = new THREE.PlaneGeometry(0, 0);
    const mat = new THREE.MeshBasicMaterial();
    this.planeXY = new THREE.Mesh(geom, mat);
    this.planeXZ = new THREE.Mesh(geom, mat);
    this.planeYZ = new THREE.Mesh(geom, mat);
    this.planeXZ.rotation.x = Math.PI / 2.0;
    this.planeYZ.rotation.y = Math.PI / 2.0;
    this.planes = [this.planeXY, this.planeXZ, this.planeYZ];
    this.planes.forEach((p) => { this.planeSystem.add(p); });
    this.scene.add(this.planeSystem);
  }
  getTHREEScene() {
    return this.scene;
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
  update() {
    if (this.boundingBox) {
      this.boundingBox.clampPoint(this.planeSystem.position, this.planeSystem.position);
    }
  }
}
