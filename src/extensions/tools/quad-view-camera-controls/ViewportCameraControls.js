import ViewportEventHandler from '../base/viewport/ViewportEventHandler';

export default class ViewportCameraControls extends ViewportEventHandler {
  constructor(viewport, container) {
    super(viewport, container);
    this.mousedownpan = this.viewport.getPan();
  }
  getViewport() {
    return this.viewport;
  }
  mouseDownAction(x, y, clickCode) {
    const propagation = super.mouseDownAction(x, y, clickCode);
    if (!propagation) {
      return false;
    }
    this.mousedownpan = this.viewport.getPan();
    return true;
  }
  mouseMoveAction(x, y, clickCode) {
    const propagation = super.mouseMoveAction(x, y, clickCode);
    if (!propagation) {
      return false;
    }
    if (clickCode === 2) {
      this.viewport.setPan({
        x: -x + this.mousedownpan.x,
        y: y + this.mousedownpan.y
      });
    }
    return true;
  }
  mouseWheelAction(deltaY) {
    const propagation = super.mouseWheelAction(deltaY);
    if (!propagation) {
      return false;
    }
    const cam = this.viewport.getTHREECamera();
    cam.zoom += -(deltaY * cam.zoom) / 600;
    if (cam.zoom < 0.5) {
      cam.zoom = 0.5;
    }
    return true;
  }
}
