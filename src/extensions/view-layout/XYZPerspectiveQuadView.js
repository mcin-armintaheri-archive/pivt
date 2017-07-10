import ViewPort, { PERSPECTIVE, ORTHOGRAPHIC, TRACKBALL } from './ViewPort';
import Layout from './Layout';

const THREE = require('three');

/**
 * A simple layout for placing 4 equal size viewports into the canvas.
 */
export default class XYZPerspectiveQuadView extends Layout {
  constructor(container, renderer) {
    super(container, renderer);
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
      TRACKBALL,
    );
    // TODO: better colors for quadrants.
    this.topleft.setClearColor(new THREE.Color().setRGB(1.0, 0.0, 0.0));
    this.ups = null;
    this.topright.setClearColor(new THREE.Color().setRGB(0.0, 1.0, 0.0));
    this.bottomleft.setClearColor(new THREE.Color().setRGB(0.0, 0.0, 1.0));
    this.bottomright.setClearColor(new THREE.Color().setRGB(0.9, 0.9, 0.9));
    this.addViewports(
      this.topleft,
      this.topright,
      this.bottomleft,
      this.bottomright,
    );
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
