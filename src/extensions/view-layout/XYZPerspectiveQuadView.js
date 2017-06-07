import ViewPort, { PERSPECTIVE, ORTHOGRAPHIC, ORBIT } from './ViewPort';
import Layout from './Layout';

export default class XYZPerspectiveQuadView extends Layout {
  constructor(canvas) {
    super(canvas);
    this.topleft = new ViewPort(0, 0.5, 0.5, 0.5, ORTHOGRAPHIC);
    this.topright = new ViewPort(0.5, 0.5, 0.5, 0.5, ORTHOGRAPHIC);
    this.bottomleft = new ViewPort(0, 0, 0.5, 0.5, ORTHOGRAPHIC);
    this.bottomright = new ViewPort(0.5, 0, 0.5, 0.5, PERSPECTIVE, ORBIT);
    this.viewports = [
      this.topleft,
      this.topright,
      this.bottomleft,
      this.bottomright,
    ];
  }
  updateMouse(x, y, width, height) {
    this.viewports.forEach(v => v.updateMouse(x, y, width, height));
  }
}
