import R from 'ramda';

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
      wheel: this.zoomCamera.bind(this)
    };
    this.container.addEventListener('mouseup', this.listeners.mouseup);
    this.container.addEventListener('mousedown', this.listeners.mousedown);
    this.container.addEventListener('wheel', this.listeners.wheel);
  }
  getViewport() {
    return this.viewport;
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
    const x = ((event.clientX - this.mousedownpos.x) / zoom) + this.mousedownpan.x;
    const y = -((event.clientY - this.mousedownpos.y) / zoom) + this.mousedownpan.y;
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
    R.keys(this.listeners).forEach((key) => {
      this.container.removeEventListener(key, this.listeners[key]);
    });
  }
}

export default class QuadViewPanner {
  constructor(view, quadViewCameraControls) {
    this.layout = view.layout;
    this.controls = quadViewCameraControls;
    this.container = this.layout.canvas;
    const viewports = [
      this.layout.getBottomLeft(),
      this.layout.getTopLeft(),
      this.layout.getTopRight()
    ];
    this.panners = viewports.map(viewport => new ViewportPanner(
      viewport,
      this.container,
      this.controls
    ));
  }
  dispose() {
    this.panners.forEach((panner) => {
      panner.dispose();
    });
  }
  serialize() {
    return this.panners.map(p => ({
      pan: p.getViewport().getPan(),
      zoom: p.getViewport().getTHREECamera().zoom
    }));
  }
  deserialize(json) {
    json.forEach((serializedPanner, i) => {
      this.panners[i].getViewport().setPan(serializedPanner.pan);
      this.panners[i].getViewport().getTHREECamera().zoom = serializedPanner.zoom;
    });
  }
}
