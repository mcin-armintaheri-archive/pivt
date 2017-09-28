import * as THREE from 'three';
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
    this.line = null;
    this.initPromise = new Promise((resolve) => { this.resolve = resolve; });
  }
  initialize(viewport, camControls) {
    this.segment = new SegmentDraw(
      this.scene.getPlaneSystem(),
      this.scene.getTHREEScene(),
      viewport.getTHREECamera(),
      {
        mouse: viewport.getMousePosReference()
      }
    );
    this.segment.on('startInteraction', () => {
      camControls.getTrackballControls().setEnabled(false);
    });
    this.segment.on('stopInteraction', () => {
      camControls.getTrackballControls().setEnabled(true);
    });
    this.segment.setBoundingBox(this.scene.getBoundingBox());
    this.segment.on('draw', (begin, end) => {
      this.line = { begin, end };
      this.segmentChangeCallbacks.forEach((f) => {
        f(begin, end);
      });
    });
    this.resolve();
  }
  onSegmentChange(callback) {
    if (callback instanceof Function) {
      this.segmentChangeCallbacks.push(callback);
    }
  }
  serialize() {
    return this.line;
  }
  deserialize(line) {
    if (line) {
      const lineStart = new THREE.Vector3(line.begin.x, line.begin.y, line.begin.z);
      const lineEnd = new THREE.Vector3(line.end.x, line.end.y, line.end.z);
      this.initPromise.then(() => {
        this.segment.drawSegment(lineStart, lineEnd);
        this.segmentChangeCallbacks.forEach((f) => {
          f(lineStart, lineEnd);
        });
      });
    }
  }
}
