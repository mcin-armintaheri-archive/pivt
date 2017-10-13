import * as THREE from 'three';
import TrackballControls from './quad-view-camera-controls/TrackballControls';

const PLUS = 107;
const MINUS = 109;

const AXES = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, 0, 1)
];

export default class SliceTraversal {
  constructor(view) {
    this.planeSystem = null;
    this.steps = AXES.map(a => a.clone());
    this.direction = new THREE.Vector3();
    view.scene.onPlanesInitialized((planeSystem) => {
      this.planeSystem = planeSystem;
    });
    this.activeControls = null;
    window.addEventListener('keydown', (evt) => {
      if (!this.planeSystem ||
          !this.activeControls ||
          (this.activeControls instanceof TrackballControls)
      ) {
        return;
      }
      let sign;
      switch (evt.keyCode) {
        case PLUS:
          sign = 1;
          break;
        case MINUS:
          sign = -1;
          break;
        default:
          sign = 0;
          break;
      }
      this.activeControls
        .getViewport()
        .getTHREECamera()
        .getWorldDirection(this.direction)
        .normalize();
      this.steps.forEach((step, i) => {
        step.copy(AXES[i]);
        step.applyQuaternion(this.planeSystem.quaternion.normalize()).normalize();
      });
      const maxstep = this.steps.reduce((step, max) => {
        const stepdot = Math.abs(step.dot(this.direction));
        const maxdot = Math.abs(max.dot(this.direction));
        if (stepdot > maxdot) {
          return step;
        }
        return max;
      });
      maxstep.multiplyScalar(sign);
      this.planeSystem.position.add(maxstep);
    });
  }
  switchActiveViewportControls(controls) {
    this.activeControls = controls;
  }
}
