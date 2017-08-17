import * as THREE from 'three';
import QuadViewCameraControlsWidget from './QuadViewCameraControlsWidget';

const OFFSET = new THREE.Vector3(0, 10, 0);

/**
 * CameraController offers an application a sidebar widget for
 * orienting a camera in a certain viewport layout.
 * @type {[type]}
 */
class CameraController {
  constructor(viewport) {
    this.viewport = viewport;
  }
  rollBy(angle, isRad = false) {
    let angRad = angle;
    if (!isRad) {
      angRad = Math.PI * (angRad / 180);
    }
    this.viewport.rollBy(angRad);
  }
  setPan(pan) {
    const { x, y } = pan;
    this.viewport.setPan({ x, y });
  }
  getViewport() {
    return this.viewport;
  }
}

/**
 * QuadViewCameraControls offers the application controls to orient all the
 * cameras in a quadview layout.
 */
export default class QuadViewCameraControls {
  constructor(view) {
    this.sidebarWidget = QuadViewCameraControlsWidget;
    this.layout = view.layout;
    this.topright = new CameraController(this.layout.getTopLeft());
    this.topleft = new CameraController(this.layout.getTopRight());
    this.bottomleft = new CameraController(this.layout.getBottomLeft());
    this.bottomright = new CameraController(this.layout.getBottomRight());
    this.resetControlsCallbacks = [];
  }
  /**
   * Reset the perspective camera and offset it in the y-direction slightly.
   */
  resetControls() {
    this.resetControlsCallbacks.forEach((f) => {
      f(OFFSET);
    });
  }
  onResetControls(f) {
    if (f instanceof Function) {
      this.resetControlsCallbacks.push(f);
    }
  }
  getLayout() {
    return this.layout;
  }
  getTopLeft() {
    return this.topleft;
  }
  getTopRight() {
    return this.topright;
  }
  getBottomLeft() {
    return this.bottomleft;
  }
  getBottomRight() {
    return this.bottomright;
  }
}
