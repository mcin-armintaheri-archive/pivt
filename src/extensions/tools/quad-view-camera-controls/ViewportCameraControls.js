import ViewportEventHandler from '../base/viewport/ViewportEventHandler';

export default class ViewportCameraControls extends ViewportEventHandler {
  constructor(viewport, container) {
    super(viewport, container);
    this.mousedownpan = this.viewport.getPan();
  }
  getViewport() {
    return this.viewport;
  }
  mouseDownAction() {
    this.mousedownpan = this.viewport.getPan();
  }
  mouseMoveAction(x, y, clickCode) {
    if (clickCode === 2) {
      this.viewport.setPan({
        x: -x + this.mousedownpan.x,
        y: y + this.mousedownpan.y
      });
    }
  }
  mouseWheelAction(deltaY) {
    const cam = this.viewport.getTHREECamera();
    cam.zoom += -(deltaY * cam.zoom) / 200;
    if (cam.zoom < 0.5) {
      cam.zoom = 0.5;
    }
  }
}
