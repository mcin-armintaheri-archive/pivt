import { SpectrumPlot2 } from 'SpectrumPlot2';
import SpectrumPlotWindow from './SpectrumPlotWindow';
import SpectrumPlotSidebarWidget from './SpectrumPlotSidebarWidget';

export default class SpectrumPlot {
  constructor() {
    this.sidebarWidget = SpectrumPlotSidebarWidget;
    this.windowConfig = {
      widget: SpectrumPlotWindow,
      title: '',
      openPosition: { x: 0.6, y: 0.02, viewportCoords: true },
      open: false,
    };
    this.series = new Array(0);
  }
  initialize(container) {
    this.spectrumplot = new SpectrumPlot2(container, 500, 400);
    this.spectrum = this.spectrumplot.addSpectrum(
      'Intensity',
      this.series,
      'rgba(0, 0, 0, 0.8)',
    );
    this.spectrumplot.setLabels();
    this.spectrumplot.draw();
  }
  setWindowTitle(title) {
    this.windowConfig.title = title;
  }
  redrawPlot() {
    if (this.spectrumplot) {
      this.spectrumplot.updateSpectrum(this.spectrum, this.series);
      this.spectrumplot.setLabels(this.labels);
      this.spectrumplot.draw();
    }
  }
  updateSeries(series, labels = null) {
    this.series = series;
    this.labels = labels;
    this.redrawPlot();
  }
}
