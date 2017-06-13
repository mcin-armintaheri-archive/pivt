import ViewPort, { PERSPECTIVE, ORTHOGRAPHIC, ORBIT } from './ViewPort';
import Layout from './Layout';

const THREE = require('three');

export default class XYZPerspectiveQuadView extends Layout {
  constructor(container) {
    super(container, true);
    this.topleft = new ViewPort(
      this.canvas,
      this.renderer,
      0.0,
      0.5,
      0.5,
      0.5,
      ORTHOGRAPHIC,
    );
    this.topright = new ViewPort(
      this.canvas,
      this.renderer,
      0.5,
      0.5,
      0.5,
      0.5,
      ORTHOGRAPHIC,
    );
    this.bottomleft = new ViewPort(
      this.canvas,
      this.renderer,
      0.0,
      0.0,
      0.5,
      0.5,
      ORTHOGRAPHIC,
    );
    this.bottomright = new ViewPort(
      this.canvas,
      this.renderer,
      0.5,
      0.0,
      0.5,
      0.5,
      PERSPECTIVE,
      ORBIT,
    );
    // TODO: better colors for quadrants.
    this.topleft.setClearColor(new THREE.Color().setRGB(1.0, 0.0, 0.0));
    this.topright.setClearColor(new THREE.Color().setRGB(0.0, 1.0, 0.0));
    this.bottomleft.setClearColor(new THREE.Color().setRGB(0.0, 0.0, 1.0));
    this.bottomright.setClearColor(new THREE.Color().setRGB(0.9, 0.9, 0.9));
    this.viewports = [
      this.topleft,
      this.topright,
      this.bottomleft,
      this.bottomright,
    ];
  }
  getViewports() {
    return this.viewports;
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
  updateMousePosition(x, y, width, height) {
    this.viewports.forEach(v => v.updateMousePosition(x, y, width, height));
  }
  render(scene) {
    this.viewports.forEach(v => v.updateCamera(scene));
  }
}
