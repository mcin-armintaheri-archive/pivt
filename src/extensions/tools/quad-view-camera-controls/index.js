import QuadViewCameraControlsWidget from './QuadViewCameraControlsWidget';

const THREE = require('three');

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
}

export default class QuadViewCameraControls {
  constructor(scene, layout) {
    this.sidebarWidget = QuadViewCameraControlsWidget;
    this.layout = layout;
    this.topright = new CameraController(this.layout.getTopLeft());
    this.topleft = new CameraController(this.layout.getTopRight());
    this.bottomleft = new CameraController(this.layout.getBottomLeft());
    this.bottomright = new CameraController(this.layout.getBottomRight());
  }
  resetTrackball() {
    this.layout.getBottomRight().resetControls(new THREE.Vector3(0, 10, 0));
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
