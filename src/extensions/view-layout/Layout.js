const THREE = require('three');

export default class Layout {
  constructor(container, context3d = true) {
    this.viewports = [];
    this.container = container;
    if (context3d) {
      this.renderer = new THREE.WebGLRenderer({ antialias: false });
      this.canvas = this.renderer.domElement;
    } else {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
    }
    container.appendChild(this.canvas);
    this.resizeCanvas();
    if (!this.updateMousePosition) {
      const err = 'Layout should implement the method "updateMouse"';
      throw err;
    }

    // Destructor for unregistering dom events.
    this.mousedownSuper = this.mouseDown.bind(this);
    this.mouseupSuper = this.mouseUp.bind(this);
    this.mousemoveSuper = this.mouseMove.bind(this);
    this.resizeSuper = this.resizeCanvas.bind(this);
    this.mouseisdown = false;
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
    this.updateLastMousePosition(x, y, width, height);
  }
  mouseUp() {
    this.mouseisdown = false;
  }
  resizeCanvas() {
    const { width, height } = this.container.getBoundingClientRect();
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
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
  updateLastMousePosition(x, y, width, height) {
    this.viewports.forEach((v) => {
      v.updateLastMousePosition(x, y, width, height);
    });
  }
  render(scene) {
    this.getViewports().forEach(v => v.updateCamera(scene));
  }
}
