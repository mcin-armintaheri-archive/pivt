import R from 'ramda';

export default class ViewportEventHandler {
  constructor(viewport, container) {
    this.viewport = viewport;
    this.container = container;
    this.mousedownpan = this.viewport.getPan();
    this.mousedownpos = { x: 0, y: 0 };
    this.mousedownbutton = null;
    this.listeners = {
      mouseup: this.mouseUp.bind(this),
      mousedown: this.mouseDown.bind(this),
      mousemove: this.mouseMove.bind(this),
      wheel: this.wheel.bind(this)
    };
    this.container.addEventListener('mouseup', this.listeners.mouseup);
    this.container.addEventListener('mousedown', this.listeners.mousedown);
    this.container.addEventListener('wheel', this.listeners.wheel);
    this.container.oncontextmenu = () => false;
  }
  getViewport() {
    return this.viewport;
  }
  mouseUp() {
    this.container.removeEventListener('mousemove', this.listeners.mousemove);
    this.mousedownbutton = null;
    if (this.mouseUpAction instanceof Function) {
      this.mouseUpAction(this.mousedownpos.x, this.mousedownpos.y, this.mousedownbutton);
    }
  }
  mouseDown(event) {
    if (this.viewport.mouseIntersects()) {
      this.mousedownpos = { x: event.clientX, y: event.clientY };
      this.mousedownbutton = event.button;
      this.mousedownpan = this.viewport.getPan();
      this.container.addEventListener('mousemove', this.listeners.mousemove);
      if (this.mouseDownAction instanceof Function) {
        this.mouseDownAction(this.mousedownpos.x, this.mousedownpos.y, this.mousedownbutton);
      }
    }
  }
  mouseMove(event) {
    if (this.mouseMoveAction instanceof Function && !isNaN(this.mousedownbutton)) {
      const zoom = this.viewport.getTHREECamera().zoom;
      const x = (event.clientX - this.mousedownpos.x) / Math.sqrt(zoom);
      const y = (event.clientY - this.mousedownpos.y) / Math.sqrt(zoom);
      this.mouseMoveAction(x, y, this.mousedownbutton);
    }
  }
  wheel(event) {
    if (this.viewport.mouseIntersects() && this.mouseWheelAction instanceof Function) {
      this.mouseWheelAction(event.deltaY);
    }
  }
  dispose() {
    R.keys(this.listeners).forEach((key) => {
      this.container.removeEventListener(key, this.listeners[key]);
    });
  }
}
