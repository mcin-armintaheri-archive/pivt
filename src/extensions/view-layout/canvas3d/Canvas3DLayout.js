import * as THREE from 'three';

/**
 * Base class for all layouts. All mouse events and resize events
 * are handled in his layout. this is so all layouts can be made simple
 * and only need to fetch the mouse coordinates stored in the super class.
 */
export default class Canvas3DLayout {
  /** Initialize the layout into the container with the renderer.
   * @param  {[type]}  container        DOM element hosting the layout
   * @param  {[type]}  renderer         Possible renderer for threejs
   * @param  {Boolean} [context3d=true] Use 2D or 3D rendering
   */
  constructor(renderer, canvas) {
    this.viewports = [];
    this.renderer = renderer;
    this.renderer.localClippingEnabled = true;
    this.canvas = canvas;
    this.resizeCanvas();
    // TODO: rxjs the events.
    this.mouseisdown = false;
    this.mousedownSuper = this.mouseDown.bind(this);
    this.mouseupSuper = this.mouseUp.bind(this);
    this.mousemoveSuper = this.mouseMove.bind(this);
  }
  getCanvas() {
    return this.canvas;
  }
  addLayoutListeners() {
    this.canvas.addEventListener('mousedown', this.mousedownSuper);
    this.canvas.addEventListener('mouseup', this.mouseupSuper);
    this.canvas.addEventListener('mousemove', this.mousemoveSuper);
  }
  removeLayoutListeners() {
    this.canvas.removeEventListener('mousedown', this.mousedownSuper);
    this.canvas.removeEventListener('mouseup', this.mouseupSuper);
    this.canvas.removeEventListener('mousemove', this.mousemoveSuper);
  }
  mouseIsDown() {
    return this.mouseisdown;
  }
  mousePosition(event) {
    const { top, left, width, height } = this.canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    return { x, y, width, height };
  }
  mouseMove(event) {
    const { x, y, width, height } = this.mousePosition(event);
    this.updateMousePosition(x, y, width, height);
  }
  mouseDown(event) {
    this.mouseisdown = true;
    const { x, y, width, height } = this.mousePosition(event);
    this.updateLastMouseDownPosition(x, y, width, height);
  }
  mouseUp() {
    this.mouseisdown = false;
    const { x, y, width, height } = this.mousePosition(event);
    this.updateLastMouseUpPosition(x, y, width, height);
  }
  resizeCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect();
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
  }
  clearCanvas() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    this.renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));
    this.renderer.clear(true, true, true);
  }
  dispose() {
    this.clearCanvas();
    this.viewports.forEach((v) => {
      if (v.controls) {
        v.controls.dispose();
      }
    });
  }
  getViewports() {
    return this.viewports;
  }
  addViewports(...viewports) {
    this.viewports = this.viewports.concat(viewports);
  }
  updateMousePosition(x, y, width, height) {
    this.viewports.forEach((v) => {
      v.updateMousePosition(x, y, width, height);
    });
  }
  updateLastMouseDownPosition(x, y, width, height) {
    this.viewports.forEach((v) => {
      v.updateLastMouseDownPosition(x, y, width, height);
    });
  }
  updateLastMouseUpPosition(x, y, width, height) {
    this.viewports.forEach((v) => {
      v.updateLastMouseUpPosition(x, y, width, height);
    });
  }
  render(scene) {
    this.resizeCanvas();
    this.getViewports().forEach(v => v.updateCamera(scene));
  }
}
