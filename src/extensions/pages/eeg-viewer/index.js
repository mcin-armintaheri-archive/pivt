
import EEGViewerPage from './EEGViewerPage';
import Page from '../Page';

class EEGCellController {
  constructor() {
    this.layout = { rows: 0, cols: 0, matrix: [] };
  }
  updateDimensions(rows, cols) {
    this.layout.rows = rows;
    this.layout.cols = cols;
  }
  updateCell(cell) {
    this.layout.matrix.filter(c => c.i !== cell.i && c.j !== cell.j);
    this.layout.matrix.push(cell);
  }
}

export default class EEGViewerView extends Page {
  constructor() {
    super([]);
    this.page = EEGViewerPage;
    this.frequencyLayoutControls = new EEGCellController();
  }
  getFrequencyController() {
    return this.frequencyLayoutControls;
  }
}
