export default {
  name: 'BrainSlicer',
  page: {
    name: 'mainPage',
    controller: 'QuadViewOrthoPlanes',
    canvas3ds: [{
      name: 'view',
      layout: 'XYZPerspectiveQuadView',
      scene: 'OrthoPlanes',
    }],
  },
  tools: [
    {
      name: 'quadviewCameraAxes',
      tool: 'QuadViewCameraAxes',
      dependencies: ['view'],
    },
    {
      name: 'intensityPlot',
      tool: 'IntensityPlotWindow',
      dependencies: ['view'],
    },
    {
      name: 'lineSegmentTool',
      tool: 'LineSegmentTool',
      dependencies: ['view'],
    },
    {
      name: 'contrast',
      tool: 'CurveTool',
      dependencies: ['view'],
    },
    {
      name: 'materialManager',
      tool: 'PlanesMaterialManager',
      dependencies: ['view'],
    },
    {
      name: 'planeParams',
      tool: 'OrthoPlanesParameters',
      dependencies: ['view'],
    },
    {
      name: 'cameraParams',
      tool: 'QuadViewCameraControls',
      dependencies: ['view'],
    },
    {
      name: 'trackball',
      tool: 'QuadviewTrackballControls',
      dependencies: ['view'],
    },
  ],
  mediators: [
    {
      mediator: 'OrthoPlanesShaderInjector',
      dependencies: ['materialManager'],
    },
    {
      mediator: 'QuadViewXYZOrthoPlanesLayers',
      dependencies: ['view', 'trackball', 'materialManager', 'planeParams', 'quadviewCameraAxes'],
    },
    {
      mediator: 'OrthoPlanesContrastSettings',
      dependencies: ['contrast', 'materialManager'],
    },
    {
      mediator: 'QuadViewXYZOrthoPlanesShifter',
      dependencies: ['view', 'trackball', 'materialManager', 'planeParams'],
    },
    {
      mediator: 'OrthoPlanesQuadViewLineSegment',
      dependencies: ['view', 'trackball', 'materialManager', 'lineSegmentTool', 'intensityPlot'],
    },
    {
      mediator: 'QuadViewPanner',
      dependencies: ['view', 'cameraParams'],
    },
    {
      mediator: 'QuadViewControlsReset',
      dependencies: ['trackball', 'cameraParams'],
    },
  ],
};
