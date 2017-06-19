const THREE = require('three');

export default class Layout {
  constructor(container, context3d = true) {
    this.viewports = [];
    this.container = container;
    this.canvas = container.querySelector('.three-mount-canvas');
    if (context3d) {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false });
    } else {
      this.context = this.canvas.getContext('2d');
    }
    container.appendChild(this.canvas);
    this.resizeCanvas();
    if (!this.updateMousePosition) {
      const err = 'Layout should implement the method "updateMouse"';
      throw err;
    }
    this.mouseisdown = false;
    this.addLayoutListeners();
  }
  addLayoutListeners() {
    this.mousedownSuper = this.mouseDown.bind(this);
    this.mouseupSuper = this.mouseUp.bind(this);
    this.mousemoveSuper = this.mouseMove.bind(this);
    this.resizeSuper = this.resizeCanvas.bind(this);
    this.canvas.addEventListener('mousedown', this.mousedownSuper);
    this.canvas.addEventListener('mouseup', this.mouseupSuper);
    this.canvas.addEventListener('mousemove', this.mousemoveSuper);
    window.addEventListener('resize', this.resizeSuper);
  }
  removeLayoutListeners() {
    this.canvas.removeEventListener('mousedown', this.mousedownSuper);
    this.canvas.removeEventListener('mouseup', this.mouseupSuper);
    this.canvas.removeEventListener('mousemove', this.mousemoveSuper);
    window.removeEventListener('resize', this.resizeSuper);
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
    const { width, height } = this.container.getBoundingClientRect();
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
    this.getViewports().forEach(v => v.updateCamera(scene));
  }
}
