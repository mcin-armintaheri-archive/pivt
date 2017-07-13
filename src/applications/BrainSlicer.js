export default {
  name: 'BrainSlicer',
  scene: 'OrthoPlanes',
  layout: 'XYZPerspectiveQuadView',
  tools: [
    {
      name: 'quadviewCameraAxes',
      tool: 'QuadViewCameraAxes',
    },
    {
      name: 'intensityPlot',
      tool: 'IntensityPlotWindow',
    },
    {
      name: 'lineSegmentTool',
      tool: 'LineSegmentTool',
    },
    {
      name: 'contrast',
      tool: 'CurveTool',
    },
    {
      name: 'materialManager',
      tool: 'PlanesMaterialManager',
    },
    {
      name: 'planeParams',
      tool: 'OrthoPlanesParameters',
    },
    {
      name: 'cameraParams',
      tool: 'QuadViewCameraControls',
    },
  ],
  mediators: [
    {
      mediator: 'OrthoPlanesShaderInjector',
      dependencies: ['scene', 'layout', 'materialManager'],
    },
    {
      mediator: 'QuadViewXYZOrthoPlanesLayers',
      dependencies: ['scene', 'layout', 'materialManager', 'planeParams', 'quadviewCameraAxes'],
    },
    {
      mediator: 'OrthoPlanesContrastSettings',
      dependencies: ['contrast', 'materialManager'],
    },
    {
      mediator: 'QuadViewXYZOrthoPlanesShifter',
      dependencies: ['scene', 'layout', 'materialManager', 'planeParams'],
    },
    {
      mediator: 'OrthoPlanesQuadViewLineSegment',
      dependencies: ['scene', 'layout', 'materialManager', 'lineSegmentTool', 'intensityPlot'],
    },
  ],
};
