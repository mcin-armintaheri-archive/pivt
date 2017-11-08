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
    this.brightnessChangeCallbacks = [];
    this.title = '';
    this.splineType = 'monotonic';
    this.addedPoints = [];
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
    this.spliner.setSplineType(this.splineType);
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
    this.spliner.on('pointAdded', (csObj, p) => {
      this.addedPoints.push(p);
      this.pointMoveCallbacks.forEach(f => f(csObj));
    });
    this.spliner.on('pointRemoved', (csObj, i) => {
      this.addedPoints.splice(i, 1);
      this.pointMoveCallbacks.forEach(f => f(csObj));
    });
  }
  onContrastChange(callback) {
    if (callback instanceof Function) {
      this.pointMoveCallbacks.push(callback);
    }
  }
  onBrightnessChange(callback) {
    if (callback instanceof Function) {
      this.brightnessChangeCallbacks.push(callback);
    }
  }
  setBrightness(brightness) {
    this.brightnessChangeCallbacks.forEach((f) => { f(brightness); });
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
  setSplineType(type) {
    this.splineType = type;
    this.spliner.setSplineType(type);
    this.spliner.draw();
  }
  getSplineType() {
    return this.splineType;
  }
  serialize() {
    const splineType = this.splineType;
    const points = this.addedPoints.map(p => ({ x: p.x, y: p.y }));
    return { points, splineType };
  }
  deserialize(json) {
    this.setSplineType(json.splineType);
    this.addedPoints = json.points.map(p => ({ x: p.x, y: p.y }));
    this.addedPoints.forEach((p) => { this.spliner.add(p); });
    this.spliner.draw();
  }
}
