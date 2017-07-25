import * as THREE from 'three';

const TrackBallControls = require('three-trackballcontrols');

export default class QuadviewTrackballControls {
  constructor(view) {
    const { layout } = view;
    this.viewport = layout.getBottomRight();
    this.camera = this.viewport.getTHREECamera();
    this.controls = new TrackBallControls(
      this.camera,
      layout.getCanvas(),
    );
    window.controls = this.controls;
    this.controls.enabled = false;
    this.controls.rotateSpeed = 4.0;
    this.controls.dynamicDampingFactor = 1.0;
    this.controls.keys = [];
    this.enableControls = this.viewport.lastMouseDownIntersects();
  }
  /**
   * Reset the camera's orientation to it's initial orientation plus
   * any offset passed.
   * @param {THREE.Vector3} offset optional positional offset of the camera's reset position.
   */
  resetControls(offset) {
    const pos = this.camera.position.clone();
    pos.z = pos.length();
    pos.x = 0;
    pos.y = 0;
    this.controls.reset();
    if (offset instanceof THREE.Vector3) {
      pos.add(offset);
    }
    this.camera.position.copy(pos);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  setEnabled(boolean) {
    this.enableControls = boolean;
  }
  update() {
    this.controls.enabled = (
      this.enableControls &&
      this.viewport.lastMouseDownIntersects()
    );
    this.controls.update();
  }
  dispose() {
    this.controls.dispose();
  }
}
