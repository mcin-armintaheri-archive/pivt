import Vue from 'vue';
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
  constructor(title, viewport) {
    this.viewport = viewport;
    this.title = title;
  }
  getTitle() {
    return this.title;
  }
  setTitle(string) {
    this.title = string;
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
  setViewport(viewport) {
    this.viewport = viewport;
  }
  flipCamera() {
    this.viewport.inversePan();
    const cam = this.viewport.getTHREECamera();
    cam.position.multiplyScalar(-1);
    cam.lookAt(ZERO);
    this.viewport.applyPan();
  }
  swapViewportWith(otherCamController) {
    const title1 = this.getTitle();
    const title2 = otherCamController.getTitle();
    const vp1 = this.getViewport();
    const vp2 = otherCamController.getViewport();
    const vpPos1 = vp1.getScreenPosition();
    const vpPos2 = vp2.getScreenPosition();
    vp1.setScreenPosition(vpPos2.left, vpPos2.bottom);
    vp2.setScreenPosition(vpPos1.left, vpPos1.bottom);
    this.setViewport(vp2);
    otherCamController.setViewport(vp1); // eslint-disable-line no-param-reassign
    this.setTitle(title2);
    otherCamController.setTitle(title1);
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
    this.topright = new CameraController('XY Plane', this.layout.getTopLeft());
    this.topleft = new CameraController('XZ Plane', this.layout.getTopRight());
    this.bottomleft = new CameraController('YZ Plane', this.layout.getBottomLeft());
    this.bottomright = new CameraController('Perspective View', this.layout.getBottomRight());
    this.resetControlsCallbacks = [];
    this.currentSwap = null;
    this.viewportMap = [0, 1, 2, 3];
  }
  swapViewport(index, camControls, vuejsSwapModes) {
    /* eslint-disable no-param-reassign */
    if (this.currentSwap === null) {
      this.currentSwap = { index, camControls };
      vuejsSwapModes.forEach((_, i) => { Vue.set(vuejsSwapModes, i, 'Here'); });
      Vue.set(vuejsSwapModes, index, 'Cancel');
      return;
    }
    if (camControls === this.currentSwap.camControls) {
      this.currentSwap = null;
      vuejsSwapModes.forEach((_, i) => { Vue.set(vuejsSwapModes, i, 'Swap Viewport'); });
      Vue.set(vuejsSwapModes, index, 'Swap Viewport');
      return;
    }
    this.currentSwap.camControls.swapViewportWith(camControls);
    const tmp = this.viewportMap[this.currentSwap.index];
    this.viewportMap[this.currentSwap.index] = this.viewportMap[index];
    this.viewportMap[index] = tmp;
    vuejsSwapModes.forEach((_, i) => { Vue.set(vuejsSwapModes, i, 'Swap Viewport'); });
    this.currentSwap = null;
  }
  openCamControls() {
    this.windowConfig.open = !this.windowConfig.open;
  }
  /**
   * Reset the perspective camera and offset it in the y-direction slightly.
   */
  resetControls() {
    this.resetControlsCallbacks.forEach((f) => { f(); });
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
