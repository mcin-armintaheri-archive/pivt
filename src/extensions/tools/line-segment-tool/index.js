import { SegmentDraw } from 'SegmentDraw';

/**
 * LineSegmentTool uses the SegmentDraw package to draw line segments
 * into an OrthoPlanes scene. When the segment tool draws, the begin
 * and end positions are propagated into event handlers that mediators
 * can call to, for example, sample a volume along the line.
 * @type {Array}
 */
export default class LineSegmentTool {
  constructor(view) {
    this.scene = view.scene;
    this.segmentChangeCallbacks = [];
  }
  initialize(viewport, camControls) {
    this.segment = new SegmentDraw(
      this.scene.getPlaneSystem(),
      this.scene.getTHREEScene(),
      viewport.getTHREECamera(),
      {
        mouse: viewport.getMousePosReference(),
      },
    );
    this.segment.on('startInteraction', () => {
      camControls.setEnabled(false);
    });
    this.segment.on('stopInteraction', () => {
      camControls.setEnabled(true);
    });
    this.segment.setBoundingBox(this.scene.getBoundingBox());
    this.segment.on('draw', (begin, end) => {
      this.segmentChangeCallbacks.forEach((f) => {
        f(begin, end);
      });
    });
  }
  onSegmentChange(callback) {
    if (callback instanceof Function) {
      this.segmentChangeCallbacks.push(callback);
    }
  }
}
