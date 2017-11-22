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
      name: 'helpWindow',
      tool: 'AppHelp',
      dependencies: []
    },
    {
      name: 'volumeInfo',
      tool: 'VolumeInfo',
      dependencies: ['view']
    },
    {
      name: 'intensityPlot',
      tool: 'IntensityPlotWindow',
      dependencies: ['view']
    },
    {
      name: 'materialManager',
      tool: 'PlanesMaterialManager',
      dependencies: ['view']
    },
    {
      name: 'mniMesh',
      tool: 'MNIMesh',
      dependencies: ['view']
    },
    {
      name: 'quadviewCameraAxes',
      tool: 'QuadViewCameraAxes',
      dependencies: ['view']
    },
    {
      name: 'lineSegmentTool',
      tool: 'LineSegmentTool',
      dependencies: ['view']
    },
    {
      name: 'planeParams',
      tool: 'OrthoPlanesParameters',
      dependencies: ['view']
    },
    {
      name: 'cameraParams',
      tool: 'QuadViewCameraParameters',
      dependencies: ['view']
    },
    {
      name: 'cameraControls',
      tool: 'QuadViewCameraControls',
      dependencies: ['view']
    },
    {
      name: 'contrast',
      tool: 'CurveTool',
      dependencies: ['view']
    },
    {
      name: 'activeViewportIndicator',
      tool: 'ActiveViewportIndicator',
      dependencies: []
    }
  ],
  mediators: [
    {
      name: 'activeViewport',
      mediator: 'ActiveViewportControlsManager',
      dependencies: ['cameraControls', 'activeViewportIndicator', 'lineSegmentTool', 'sliceTraversal']
    },
    {
      name: 'planeLayers',
      mediator: 'QuadViewXYZOrthoPlanesLayers',
      dependencies: ['view', 'materialManager', 'cameraControls', 'planeParams', 'quadviewCameraAxes']
    },
    {
      name: 'constrastSettings',
      mediator: 'OrthoPlanesContrastSettings',
      dependencies: ['contrast', 'materialManager']
    },
    {
      name: 'planeShifter',
      mediator: 'QuadViewXYZOrthoPlanesShifter',
      dependencies: ['view', 'cameraControls', 'materialManager', 'planeParams']
    },
    {
      name: 'lineSegmentMediator',
      mediator: 'LineSegmentTransmitter',
      dependencies: ['view', 'cameraControls', 'materialManager', 'lineSegmentTool', 'intensityPlot', 'volumeInfo']
    },
    {
      name: 'cameraControlsReset',
      mediator: 'QuadViewControlsReset',
      dependencies: ['cameraControls', 'cameraParams']
    },
    {
      name: 'brainSlicerHelp',
      mediator: 'BrainSlicerHelp',
      dependencies: ['helpWindow']
    },
    {
      name: 'shaderTransmitter',
      mediator: 'PlanesShaderTransmitter',
      dependencies: ['materialManager', 'volumeInfo', 'intensityPlot', 'mniMesh']
    }
  ]
};
