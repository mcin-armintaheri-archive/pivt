import { SpectrumPlot2 } from 'SpectrumPlot2';
import SpectrumPlotWindow from './SpectrumPlotWindow';
import SpectrumPlotSidebarWidget from './SpectrumPlotSidebarWidget';

export default class SpectrumPlot {
  constructor() {
    this.sidebarWidget = SpectrumPlotSidebarWidget;
    this.floatingWindowWidget = SpectrumPlotWindow;
    this.windowConfig = {
      widget: SpectrumPlotWindow,
      title: '',
      openPosition: { x: 0.6, y: 0.02, viewportCoords: true },
      open: true,
    };
  }
  initialize(container) {
    this.spectrumplot = new SpectrumPlot2(container, 500, 400);
  }
  setWindowTitle(title) {
    this.windowConfig.title = title;
  }
}
