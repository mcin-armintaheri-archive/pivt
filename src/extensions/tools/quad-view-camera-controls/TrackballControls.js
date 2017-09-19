import * as THREE from 'three';
import ViewportCameraControls from './ViewportCameraControls';

const ZERO = new THREE.Vector3(0, 0, 0);

export default class TrackballControls extends ViewportCameraControls {
  constructor(viewport, container) {
    super(viewport, container);
    this.enabled = true;
    this.lastMouse = null;
    this.resetPosition = new THREE.Vector3();
    this.dscreen = new THREE.Vector2();
    this.rotAxis = new THREE.Vector3();
    this.mouseScreenToWorld = new THREE.Vector3();
    this.dQuat = new THREE.Quaternion();
    this.resetControls();
  }
  mouseUpAction() {
    this.lastMouse = null;
  }
  mouseMoveAction(x, y, clickCode) {
    super.mouseMoveAction(x, y, clickCode);
    if (this.enabled && clickCode === 0) {
      if (!this.lastMouse) {
        this.lastMouse = { x, y };
        return;
      }
      const viewport = this.getViewport();
      const cam = viewport.getTHREECamera();
      const { xDir, yDir, zDir } = viewport.getCameraAxes();
      viewport.inversePan();
      this.dscreen.set(
        -(x - this.lastMouse.x) / 150,
        (y - this.lastMouse.y) / 150
      );
      this.mouseScreenToWorld = xDir.clone()
        .multiplyScalar(this.dscreen.x)
        .add(yDir.clone().multiplyScalar(this.dscreen.y));
      this.rotAxis.crossVectors(zDir, this.mouseScreenToWorld).normalize();
      const angle = this.dscreen.length();
      this.dQuat.setFromAxisAngle(this.rotAxis, angle);
      cam.position.applyQuaternion(this.dQuat);
      cam.up.applyQuaternion(this.dQuat);
      cam.lookAt(ZERO);
      viewport.applyPan();
      this.lastMouse = { x, y };
    }
  }
  setResetPosition(x, y, z) {
    this.resetPosition.set(x, y, z);
  }
  resetControls() {
    const cam = this.getViewport().getTHREECamera();
    cam.position.copy(this.resetPosition);
    cam.up.set(0, 1, 0);
    cam.lookAt(ZERO);
  }
  setEnabled(boolean) {
    this.enabled = boolean;
  }
}