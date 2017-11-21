import { SpectrumPlot2 } from 'SpectrumPlot2';
import SpectrumPlotWindow from './SpectrumPlotWindow';
import SpectrumPlotSidebarWidget from './SpectrumPlotSidebarWidget';

/**
 * Wrapper class for the SpectrumPlot2 package. A floating window is
 * defined in SpectrumPlotWindow and the intensity plot given a series
 * in drawn into the floating window using SpectrumPlot2.
 * @type {[type]}
 */
export default class IntensityPlotWindow {
  constructor() {
    this.sidebarWidget = SpectrumPlotSidebarWidget;
    this.windowConfig = {
      widget: SpectrumPlotWindow,
      title: 'Intensity Plot',
      openPosition: { x: 0.6, y: 0.02, viewportCoords: true },
      open: false
    };
    this.spectrums = [];
    this.series = [];
    this.labels = [];
    this.rootContainer = null;
    this.plotDiv = document.createElement('div');
    this.spectrumplot = new SpectrumPlot2(this.plotDiv, 500, 400);
    const canvStyle = this.plotDiv.querySelector('canvas').style;
    canvStyle.width = '500px';
    canvStyle.height = '400px';
    this.spectrumplot.showLegend(true);
    this.spectrumplot.setLabels();
  }
  initialize(container) {
    if (this.rootContainer) {
      this.rootContainer.removeChild(this.plotDiv);
    }
    this.rootContainer = container;
    this.rootContainer.appendChild(this.plotDiv);
    this.spectrumplot.draw();
  }
  setWindowTitle(title) {
    this.windowConfig.title = title;
  }
  redrawPlot() {
    if (this.spectrumplot) {
      this.spectrums.forEach((s, i) => {
        this.spectrumplot.updateSpectrum(s, this.series[i]);
      });
      this.spectrumplot.setLabels(this.labels);
      this.spectrumplot.draw();
    }
  }
  setLineSegment(begin, end, overlaySegments) {
    if (overlaySegments.length === 0) {
      this.series = [];
      this.labels = [];
    } else {
      this.series = overlaySegments.map(o => o.values[0]);
      this.labels = overlaySegments[0].labels;
    }
    this.redrawPlot();
  }
  setShaderManager(shaderManager) {
    /* eslint-disable no-underscore-dangle */
    const rCol = () => Math.floor(254 * Math.random());
    if (this.spectrumplot) {
      this.spectrumplot._chartData.datasets = [];
      this.spectrums = shaderManager.getMRIs()
        .map((overlay) => {
          const color = `rgba(${rCol()}, ${rCol()}, ${rCol()}, 0.8)`;
          return this.spectrumplot.addSpectrum(overlay.getName(), [], color);
        });
      this.redrawPlot();
    }
  }
}
