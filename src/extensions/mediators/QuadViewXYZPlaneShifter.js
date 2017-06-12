import { PlaneShifter } from 'PlaneShifter';


export default class QuadViewXYZPlaneShifter {
  constructor(scene, layout) {
    this.planeshifter = new PlaneShifter(
      scene.getSystem(),
      layout.getBottomRight().getTHREECamera(),
      layout.getBottomRight().getTHREEControls(),
      layout.getBottomRight().getMousePosReference(),
    );
  }
}
