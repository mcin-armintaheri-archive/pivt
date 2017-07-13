import { SpectrumPlot2 } from '../../../../../SpectrumPlot2/src/SpectrumPlot2';
import EEGPlot from './EEGPlot';

class EEGPlotController {
  constructor() {
    this.toolComponent = EEGPlot;
    this.onInitCallbacks = [];
  }
  initialize(container) {
    this.spectrumplot = new SpectrumPlot2(container, 150, 140, { decimals: 2 });
    const series = [...Array(100).keys()].map(() => Math.random(10));
    this.spectrum = this.spectrumplot.addSpectrum(
      'Amplitude',
      series,
      'rgba(0, 0, 0, 0.8)',
    );
    this.spectrumplot.showLegend(false);
    this.spectrumplot.showXLabels(false);
    this.spectrumplot.setLabels();
    this.spectrumplot.enableMarkers();
    this.onInitCallbacks.forEach(f => f(this.spectrumplot));
    this.spectrumplot.draw();
  }
  getPlot() {
    return this.spectrumplot;
  }
  onInitialize(callback) {
    if (callback instanceof Function) {
      this.onInitCallbacks.push(callback);
    }
  }
}

export default class EEGSpectrumPlot {
  constructor(layout) {
    this.layout = layout;
    this.initEEGPlots();
  }
  initEEGPlots() {
    this.layout.updateDimensions(5, 5);
    this.plotControllers = [];
    const cells = [
      { i: 1, j: 0 },
      { i: 2, j: 0 },
      { i: 3, j: 0 },
      { i: 0, j: 1 },
      { i: 0, j: 3 },
      { i: 1, j: 1 },
      { i: 1, j: 2 },
      { i: 1, j: 3 },
      { i: 2, j: 1 },
      { i: 2, j: 2 },
      { i: 2, j: 3 },
      { i: 3, j: 1 },
      { i: 3, j: 2 },
      { i: 3, j: 3 },
      { i: 4, j: 1 },
      { i: 4, j: 3 },
      { i: 1, j: 4 },
      { i: 2, j: 4 },
      { i: 3, j: 4 },
    ];
    cells.forEach((c) => {
      const cell = { controller: new EEGPlotController() };
      cell.controller.onInitialize((plot) => {
        plot.on('click', (data) => {
          if (!data.length) {
            return;
          }
          this.plotControllers.forEach((ctrl) => {
            if (plot !== ctrl) {
              ctrl.getPlot().setVerticalClickMarkerValue(data[0].x);
            }
          });
        });
      });
      this.plotControllers.push(cell.controller);
      Object.assign(cell, c);
      this.layout.updateCell(cell);
    });
  }
}
