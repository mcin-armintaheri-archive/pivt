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
  constructor(index, title, viewport) {
    this.state = {
      title,
      viewport,
      quadPosition: index,
      flipped: false
    };
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
  }
  getTitle() {
    return this.state.title;
  }
  setTitle(string) {
    this.state.title = string;
  }
  getQuadPosition() {
    return this.state.quadPosition;
  }
  setQuadPosition(i) {
    this.state.quadPosition = i;
  }
  rollBy(angle, isRad = false) {
    let angRad = angle;
    if (!isRad) {
      angRad = Math.PI * (angRad / 180);
    }
    this.state.viewport.rollBy(angRad);
  }
  setPan(pan) {
    const { x, y } = pan;
    this.state.viewport.setPan({ x, y });
  }
  getViewport() {
    return this.state.viewport;
  }
  setViewport(viewport) {
    this.state.viewport = viewport;
  }
  isFlipped() {
    return this.state.flipped;
  }
  flipCamera() {
    this.state.viewport.inversePan();
    const cam = this.state.viewport.getTHREECamera();
    cam.position.multiplyScalar(-1);
    cam.lookAt(ZERO);
    this.state.viewport.applyPan();
    this.state.flipped = !this.state.flipped;
  }
  swapViewportWith(otherCamController) {
    const vp1 = this.getViewport();
    const vp2 = otherCamController.getViewport();
    const vpPos1 = vp1.getScreenPosition();
    const vpPos2 = vp2.getScreenPosition();
    vp1.setScreenPosition(vpPos2.left, vpPos2.bottom);
    vp2.setScreenPosition(vpPos1.left, vpPos1.bottom);
    const state1 = this.state;
    const state2 = otherCamController.state;
    this.state = state2;
    otherCamController.state = state1; // eslint-disable-line no-param-reassign
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
    this.camControlsList = [
      new CameraController(0, 'YZ Plane', this.layout.getBottomLeft()),
      new CameraController(1, 'XY Plane', this.layout.getTopRight()),
      new CameraController(2, 'XZ Plane', this.layout.getTopLeft()),
      new CameraController(3, 'Perspective View', this.layout.getBottomRight())
    ];
    this.resetControlsCallbacks = [];
    this.currentSwap = null;
  }
  getCamControls(index) {
    return this.camControlsList[index];
  }
  getOrthoParams() {
    return this.camControlsList.filter(c => c.getViewport().getType() === 'ORTHOGRAPHIC');
  }
  getPerspParams() {
    return this.camControlsList.filter(c => c.getViewport().getType() === 'PERSPECTIVE');
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
    this.getOrthoParams().forEach((c) => { c.getViewport().setPan({ x: 0, y: 0 }); });
    this.camControlsList.forEach((c) => { c.getViewport().getTHREECamera().zoom = 1; });
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
  serialize() {
    return {
      permutation: this.camControlsList.map(c => c.getQuadPosition()),
      flipped: this.camControlsList.map(c => c.isFlipped())
    };
  }
  deserialize(json) {
    const { permutation, flipped } = json;
    const states = this.camControlsList.map(c => c.getState());
    const vpPositions = this.camControlsList.map(c => c.getViewport().getScreenPosition());
    permutation.forEach((i1, i2) => {
      const { left, bottom } = vpPositions[i2];
      this.camControlsList[i1].getViewport().setScreenPosition(left, bottom);
      this.camControlsList[i1].setState(states[i2]);
      if (flipped[i2]) {
        this.camControlsList[i2].flipCamera();
      }
    });
  }
}
