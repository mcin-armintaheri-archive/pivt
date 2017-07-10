import { SegmentDraw } from 'SegmentDraw';

/**
 * LineSegmentTool uses the SegmentDraw package to draw line segments
 * into an OrthoPlanes scene. When the segment tool draws, the begin
 * and end positions are propagated into event handlers that mediators
 * can call to, for example, sample a volume along the line.
 * @type {Array}
 */
export default class LineSegmentTool {
  constructor() {
    this.segmentChangeCallbacks = [];
  }
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