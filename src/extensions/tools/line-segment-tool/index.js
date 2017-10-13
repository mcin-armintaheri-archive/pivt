import * as THREE from 'three';
import { SegmentDraw } from 'SegmentDraw';

/* eslint-disable no-underscore-dangle */

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
    this.segment._sampleSegment.segment.layers.enable(0);
    this.segment._sampleSegment.segment.layers.enable(1);
    this.segment._sampleSegment.segment.layers.enable(2);
    this.segment._sampleSegment.segment.layers.enable(3);
    this.segment.on('startInteraction', () => {
      camControls.getViewportControls().forEach((c) => { c.setEnabled(false); });
    });
    this.segment.on('stopInteraction', () => {
      camControls.getViewportControls().forEach((c) => { c.setEnabled(true); });
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
  switchActiveViewportControls(controls) {
    if (!this.segment) {
      return;
    }
    const viewport = controls.getViewport();
    this.segment._camera = viewport.getTHREECamera();
    this.segment._mouse = viewport.getMousePosReference();
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
