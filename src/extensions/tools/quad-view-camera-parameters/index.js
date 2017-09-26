import * as THREE from 'three';
import QuadViewCameraControlsWindow from './QuadViewCameraControlsWindow';
import QuadViewCameraControlsSidebarWidget from './QuadViewCameraControlsSidebarWidget';

const ZERO = new THREE.Vector3(0, 0, 0);
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
  flipCamera() {
    this.viewport.inversePan();
    const cam = this.viewport.getTHREECamera();
    cam.position.multiplyScalar(-1);
    cam.lookAt(ZERO);
    this.viewport.applyPan();
  }
}

/**
 * QuadViewCameraControls offers the application controls to orient all the
 * cameras in a quadview layout.
 */
export default class QuadViewCameraParameters {
  constructor(view) {
    this.sidebarWidget = QuadViewCameraControlsSidebarWidget;
    this.windowConfig = {
      widget: QuadViewCameraControlsWindow,
      title: 'Camera Parameters',
      openPosition: { x: 0.45, y: 0.02, viewportCoords: true },
      open: false
    };
    this.layout = view.layout;
    this.topright = new CameraController(this.layout.getTopLeft());
    this.topleft = new CameraController(this.layout.getTopRight());
    this.bottomleft = new CameraController(this.layout.getBottomLeft());
    this.bottomright = new CameraController(this.layout.getBottomRight());
    this.resetControlsCallbacks = [];
  }
  openCamControls() {
    this.windowConfig.open = true;
  }
  /**
   * Reset the perspective camera and offset it in the y-direction slightly.
   */
  resetControls() {
    this.resetControlsCallbacks.forEach((f) => {
      f();
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
