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
    this.pointMoveCallbacks = [];
    this.title = '';
  }
  /**
   * Given a DOM container, inject the curve spliner tool into the element
   * and add controls points to (0,0) and (1,1). When the spliner is updated,
   * call all handlers bound to this event.
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  initialize(container) {
    this.spliner = new CanvasSpliner(container, 250, 250);
    this.spliner.add({ x: 0, y: 0, xLocked: true, safe: true });
    this.spliner.add({ x: 1, y: 1, xLocked: true, safe: true });
    this.spliner.setBackgroundColor('#ffffff');
    this.spliner.draw();
    let locked = false;
    this.spliner.on('movePoint', (csObj) => {
      if (!locked) {
        this.pointMoveCallbacks.forEach(f => f(csObj));
        locked = true;
        setTimeout(() => { locked = false; }, 100);
      }
    });
    this.spliner.on('releasePoint', (csObj) => {
      this.pointMoveCallbacks.forEach(f => f(csObj));
    });
    this.spliner.on('pointAdded', (csObj) => {
      this.pointMoveCallbacks.forEach(f => f(csObj));
    });
    this.spliner.on('pointRemoved', (csObj) => {
      this.pointMoveCallbacks.forEach(f => f(csObj));
    });
  }
  onChange(callback) {
    if (callback instanceof Function) {
      this.pointMoveCallbacks.push(callback);
    }
  }
  getSpliner() {
    return this.spliner;
  }
  /**
   * Set the title of the sidebar widget.
   * @param {String} title
   */
  setTitle(title) {
    this.title = title;
  }
}
