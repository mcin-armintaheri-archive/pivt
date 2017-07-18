class ViewportPanner {
  constructor(viewport, container, controls) {
    this.viewport = viewport;
    this.container = container;
    this.controls = controls;
    this.mousedownpan = this.viewport.getPan();
    this.mousedownpos = { x: 0, y: 0 };
    this.listeners = {
      mouseup: this.mouseUp.bind(this),
      mousedown: this.mouseDown.bind(this),
      mousemove: this.panCamera.bind(this),
      wheel: this.zoomCamera.bind(this),
    };
    this.container.addEventListener('mouseup', this.listeners.mouseup);
    this.container.addEventListener('mousedown', this.listeners.mousedown);
    this.container.addEventListener('wheel', this.listeners.wheel);
  }
  mouseUp() {
    this.container.removeEventListener('mousemove', this.listeners.mousemove);
  }
  mouseDown(event) {
    if (this.viewport.mouseIntersects() && event.button === 2) {
      this.mousedownpan = this.viewport.getPan();
      this.mousedownpos = { x: event.clientX, y: event.clientY };
      this.container.addEventListener('mousemove', this.listeners.mousemove);
    }
  }
  panCamera(event) {
    const zoom = this.viewport.getTHREECamera().zoom;
    const x = (-(event.clientX - this.mousedownpos.x) + this.mousedownpan.x) / zoom;
    const y = ((event.clientY - this.mousedownpos.y) + this.mousedownpan.y) / zoom;
    this.viewport.setPan({ x, y });
  }
  zoomCamera(event) {
    if (this.viewport.mouseIntersects()) {
      const cam = this.viewport.getTHREECamera();
      cam.zoom += (-event.deltaY / 500);
      if (cam.zoom < 0.5) {
        cam.zoom = 0.5;
      }
    }
  }
  dispose() {
    Object.keys(this.listeners).forEach((key) => {
      this.container.removeEventListener(key, this.listeners[key]);
    });
  }
}

export default class QuadViewPanner {
  constructor(layout, quadViewCameraControls) {
    this.layout = layout;
    this.controls = quadViewCameraControls;
    this.container = this.layout.container;
    const viewports = [
      layout.getBottomLeft(),
      layout.getTopLeft(),
      layout.getTopRight(),
    ];
    this.panners = viewports.map(viewport => new ViewportPanner(
      viewport,
      this.container,
      this.controls,
    ));
  }
  dispose() {
    this.panners.forEach((panner) => {
      panner.dispose();
    });
  }
}
