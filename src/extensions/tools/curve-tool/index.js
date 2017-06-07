import { CanvasSpliner } from 'CanvasSpliner';
import CurveToolWidget from './CurveToolWidget';

export default class CurveTool {
  constructor() {
    this.sidebarWidget = CurveToolWidget;
  }
  initialize() {
    this.spliner = new CanvasSpliner('curve-tool-mount', 250, 250);
    this.spliner.add({ x: 0, y: 0, xLocked: true, safe: true });
    this.spliner.add({ x: 1, y: 1, xLocked: true, safe: true });
    this.spliner.setBackgroundColor('#ffffff');
    this.spliner.draw();
  }
  getSpliner() {
    return this.spliner;
  }
}
