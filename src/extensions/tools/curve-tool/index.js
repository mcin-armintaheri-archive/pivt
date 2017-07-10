import { CanvasSpliner } from 'CanvasSpliner';
import CurveToolWidget from './CurveToolWidget';

/**
 * CurveTool uses the CanvasSpliner package to send interpolated values through
 * control points. This tool is handy for mediators that would like
 * to have a continuous map defined by the user graphically.
 */
export default class CurveTool {
  constructor() {
    this.sidebarWidget = CurveToolWidget;
    this.pointMoveCallback = function empty() {};
    this.title = '';
  }
  initialize(container) {
    this.spliner = new CanvasSpliner(container, 250, 250);
    this.spliner.add({ x: 0, y: 0, xLocked: true, safe: true });
    this.spliner.add({ x: 1, y: 1, xLocked: true, safe: true });
    this.spliner.setBackgroundColor('#ffffff');
    this.spliner.draw();
    let ctn = 0;
    this.spliner.on('movePoint', (csObj) => {
      ctn += 1;
      if (ctn % 5 === 0) {
        this.pointMoveCallback.bind(this)(csObj);
      }
    });
    this.spliner.on('releasePoint', this.pointMoveCallback.bind(this));
    this.spliner.on('pointAdded', this.pointMoveCallback.bind(this));
    this.spliner.on('pointRemoved', this.pointMoveCallback.bind(this));
  }
  onChange(callback) {
    if (callback instanceof Function) {
      this.pointMoveCallback = callback;
    }
  }
  getSpliner() {
    return this.spliner;
  }
  setTitle(title) {
    this.title = title;
  }
}
