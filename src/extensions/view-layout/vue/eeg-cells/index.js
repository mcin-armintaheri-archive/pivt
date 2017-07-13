import EEGCells from './EEGCells';

export default class CellGrid {
  constructor() {
    this.layoutComponent = EEGCells;
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
