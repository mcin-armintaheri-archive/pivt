import { SegmentDraw } from 'SegmentDraw';

export default class LineSegmentTool {
  initialize(scene, viewport) {
    this.segment = new SegmentDraw(
      scene.getPlaneSystem(),
      scene.getTHREEScene(),
      viewport.getTHREECamera(),
      {
        mouse: viewport.getMousePosReference(),
      },
    );
    this.segment.on('startInteraction', () => {
      viewport.setEnabled(false);
    });
    this.segment.on('stopInteraction', () => {
      viewport.setEnabled(true);
    });
    this.segment.setBoundingBox(scene.getBoundingBox());
  }
}
