export default {
  name: 'EEGViewer',
  layout: 'CellGrid',
  tools: [
    {
      name: 'eegPlots',
      tool: 'EEGSpectrumPlot',
    },
    {
      name: 'eegFileLoader',
      tool: 'EEGFileLoader',
    },
  ],
  mediators: [],
};
