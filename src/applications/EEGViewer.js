export default {
  type: 'EEGViewer',
  page: {
    name: 'mainPage',
    controller: 'EEGViewer',
    canvas3ds: [],
  },
  tools: [
    {
      name: 'eegPlots',
      tool: 'EEGSpectrumPlot',
      dependencies: ['mainPage'],
    },
    {
      name: 'eegFileLoader',
      tool: 'EEGFileLoader',
      dependencies: ['mainPage'],
    },
  ],
  mediators: [],
};
