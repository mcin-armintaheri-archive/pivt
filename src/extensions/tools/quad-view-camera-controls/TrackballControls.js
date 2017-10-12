import * as THREE from 'three';
import ViewportCameraControls from './ViewportCameraControls';

const ZERO = new THREE.Vector3(0, 0, 0);

export default class TrackballControls extends ViewportCameraControls {
  constructor(viewport, container) {
    super(viewport, container);
    this.lastMouse = null;
    this.resetPosition = new THREE.Vector3();
    this.quatOffset = null;
    this.dscreen = new THREE.Vector2();
    this.rotAxis = new THREE.Vector3();
    this.mouseScreenToWorld = new THREE.Vector3();
    this.dQuat = new THREE.Quaternion();
    this.resetControls();
  }
  mouseUpAction(x, y, clickCode) {
    const propagation = super.mouseUpAction(x, y, clickCode);
    if (!propagation) {
      return false;
    }
    this.lastMouse = null;
    return true;
  }
  mouseMoveAction(x, y, clickCode) {
    const propagation = super.mouseMoveAction(x, y, clickCode);
    if (!propagation || !this.enabled) {
      return false;
    }
    if (clickCode === 0) {
      if (!this.lastMouse) {
        this.lastMouse = { x, y };
        return true;
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
    return true;
  }
  setResetPosition(pos) {
    this.resetPosition.copy(pos);
  }
  getResetPosition() {
    return this.resetPosition;
  }
  setQuaternionOffset(quat) {
    this.quatOffset = quat;
  }
  getQuaternionOffset() {
    return this.quatOffset;
  }
  resetControls() {
    const cam = this.getViewport().getTHREECamera();
    this.getViewport().setPan({ x: 0, y: 0 });
    cam.position.copy(this.resetPosition);
    cam.up.set(0, 1, 0);
    if (this.quatOffset) {
      cam.up.applyQuaternion(this.quatOffset);
      cam.position.applyQuaternion(this.quatOffset);
    }
    cam.lookAt(ZERO);
  }
}
