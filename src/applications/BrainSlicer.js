export default {
  type: 'BrainSlicer',
  page: {
    name: 'mainPage',
    controller: 'QuadViewOrthoPlanes',
    canvas3ds: [{
      name: 'view',
      layout: 'XYZPerspectiveQuadView',
      scene: 'OrthoPlanes'
    }]
  },
  tools: [
    {
      name: 'materialManager',
      tool: 'PlanesMaterialManager',
      dependencies: ['view']
    },
    {
      name: 'quadviewCameraAxes',
      tool: 'QuadViewCameraAxes',
      dependencies: ['view']
    },
    {
      name: 'intensityPlot',
      tool: 'IntensityPlotWindow',
      dependencies: ['view']
    },
    {
      name: 'lineSegmentTool',
      tool: 'LineSegmentTool',
      dependencies: ['view']
    },
    {
      name: 'contrast',
      tool: 'CurveTool',
      dependencies: ['view']
    },
    {
      name: 'planeParams',
      tool: 'OrthoPlanesParameters',
      dependencies: ['view']
    },
    {
      name: 'cameraParams',
      tool: 'QuadViewCameraControls',
      dependencies: ['view']
    },
    {
      name: 'trackball',
      tool: 'QuadviewTrackballControls',
      dependencies: ['view']
    }
  ],
  mediators: [
    {
      name: 'shaderInjector',
      mediator: 'OrthoPlanesShaderInjector',
      dependencies: ['materialManager']
    },
    {
      name: 'planeLayers',
      mediator: 'QuadViewXYZOrthoPlanesLayers',
      dependencies: ['view', 'trackball', 'materialManager', 'planeParams', 'quadviewCameraAxes']
    },
    {
      name: 'constrastSettings',
      mediator: 'OrthoPlanesContrastSettings',
      dependencies: ['contrast', 'materialManager']
    },
    {
      name: 'planeShifter',
      mediator: 'QuadViewXYZOrthoPlanesShifter',
      dependencies: ['view', 'trackball', 'materialManager', 'planeParams']
    },
    {
      name: 'lineSegmentMediator',
      mediator: 'OrthoPlanesQuadViewLineSegment',
      dependencies: ['view', 'trackball', 'materialManager', 'lineSegmentTool', 'intensityPlot']
    },
    {
      name: 'viewPanner',
      mediator: 'QuadViewPanner',
      dependencies: ['view', 'cameraParams']
    },
    {
      name: 'cameraControlsReset',
      mediator: 'QuadViewControlsReset',
      dependencies: ['trackball', 'cameraParams']
    }
  ]
};
