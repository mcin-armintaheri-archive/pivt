import Application from './Application';
import CanvasLayout from './view-layout/canvas/CanvasLayout';

// Begin Layout Imports
import XYZPerspectiveQuadView from './view-layout/canvas/XYZPerspectiveQuadView';
import CellGrid from './view-layout/vue/eeg-cells/';
// End Layout Imports

// Begin Scene Imports
import OrthoPlanes from './scene/OrthoPlanes';
// End Scene Imports


// Begin Tool and Mediator Imports
import CurveTool from './tools/curve-tool/';
import OrthoPlanesShaderInjector from './mediators/OrthoPlanesShaderInjector';
import QuadViewXYZOrthoPlanesLayers from './mediators/QuadViewXYZOrthoPlanesLayers';
import QuadViewXYZOrthoPlanesShifter from './mediators/QuadViewXYZOrthoPlanesShifter';
import OrthoPlanesContrastSettings from './mediators/OrthoPlanesContrastSettings';
import PlanesMaterialManager from './tools/planes-material-manager';
import OrthoPlanesParameters from './tools/ortho-planes-parameters';
import QuadViewCameraControls from './tools/quad-view-camera-controls';
import QuadViewCameraAxes from './tools/quad-view-camera-axes';
import LineSegmentTool from './tools/line-segment-tool';
import OrthoPlanesQuadViewLineSegment from './mediators/OrthoPlanesQuadViewLineSegment';
import IntensityPlotWindow from './tools/intensity-plot-window';
import EEGSpectrumPlot from './tools/eeg-spectrum-plot';
import EEGFileLoader from './tools/eeg-file-loader';
import QuadViewPanner from './mediators/QuadViewPanner';
// End Tool and Mediator Imports

export default class ApplicationManager {
  constructor() {
    this.registry = {};

    // Begin Layout Registers
    this.registerConstructor('XYZPerspectiveQuadView', XYZPerspectiveQuadView);
    this.registerConstructor('CellGrid', CellGrid);
    // End Layout Registers

    // Begin Scene Registers
    this.registerConstructor('OrthoPlanes', OrthoPlanes);
    // End Scene Registers

    // Begin Tool and Mediator Registers
    this.registerConstructor('CurveTool', CurveTool);
    this.registerConstructor('XYZPerspectiveQuadView', XYZPerspectiveQuadView);
    this.registerConstructor('OrthoPlanesShaderInjector', OrthoPlanesShaderInjector);
    this.registerConstructor('QuadViewXYZOrthoPlanesLayers', QuadViewXYZOrthoPlanesLayers);
    this.registerConstructor('QuadViewXYZOrthoPlanesShifter', QuadViewXYZOrthoPlanesShifter);
    this.registerConstructor('OrthoPlanesContrastSettings', OrthoPlanesContrastSettings);
    this.registerConstructor('PlanesMaterialManager', PlanesMaterialManager);
    this.registerConstructor('OrthoPlanesParameters', OrthoPlanesParameters);
    this.registerConstructor('QuadViewCameraControls', QuadViewCameraControls);
    this.registerConstructor('QuadViewCameraAxes', QuadViewCameraAxes);
    this.registerConstructor('LineSegmentTool', LineSegmentTool);
    this.registerConstructor('OrthoPlanesQuadViewLineSegment', OrthoPlanesQuadViewLineSegment);
    this.registerConstructor('IntensityPlotWindow', IntensityPlotWindow);
    this.registerConstructor('EEGSpectrumPlot', EEGSpectrumPlot);
    this.registerConstructor('EEGFileLoader', EEGFileLoader);
    this.registerConstructor('QuadViewPanner', QuadViewPanner);
    // End Tool and Mediator Registers
  }
  /**
   * [create Build an application out of a JSON description]
   * The description of the application is formatted as follows:
   * ExtensionJSON = {
   *  'name': 'myNewVisualization', #The name is a camel-cased string.
   *  'scene': 'OrthoPlane', #The name of the scene constructor.
   *  'layout': 'XYZPerspectiveQuadView', #The name of the camera layout constructor.
   *  'tools': [ #The tools that operate on the scene and layout
   *    'CurveTool', #Update constrast of voxels sampled in the plane materials.
   *    'PlaneShifter',  #Interact with the planes.
   *    'OrthoPanner', #Pan the planes using orthographic cameras.
   *    'ColorMap', #Show a colormap in the side bar.
   *  ],
   *  'mediators': [ #The mediators between the scene, layout, and tools.
   *    {
   *      'type': 'CurveToolMediator', #The curve tool's channel to the color map and scene.
   *      'dependencies': ['scene', 'CurveTool', 'ColorMap'],
   *    }
   *  ],
   * }
   * @param  {[DOMElement]} viewContainer [The DOM element that will host the
   * canvas of the application's view.]
   * @param  {[JSON]} jsonDescription [JSON-serializable description of the application]
   * @return {[Application]} [A running instantiation of the application's description]
   */
  create(index, viewContainer, renderer, jsonDescription) {
    const {
      name,
      scene,
      layout,
      tools,
      mediators,
    } = jsonDescription;
    const dependencies = {};
    const application = new Application(`${name} ${index}`);
    const sceneObj = scene ? this.createFromConstructorName(scene, viewContainer) : null;
    let layoutObj;
    if (this.mapToConstructor(layout).prototype instanceof CanvasLayout) {
      layoutObj = this.createFromConstructorName(layout, viewContainer, renderer);
    } else {
      layoutObj = this.createFromConstructorName(layout);
    }
    dependencies.scene = sceneObj;
    application.setScene(sceneObj);
    dependencies.layout = layoutObj;
    application.setLayout(layoutObj);
    tools.forEach((toolMeta) => {
      const args = sceneObj ? [sceneObj, layoutObj] : [layoutObj];
      const toolObj = this.createFromConstructorName(toolMeta.tool, ...args);
      dependencies[toolMeta.name] = toolObj;
      application.addTool(toolObj);
    });
    mediators.forEach((medMeta) => {
      const deps = medMeta.dependencies.map(d => dependencies[d]);
      const mediatorObj = this.createFromConstructorName(medMeta.mediator, ...deps);
      application.addMediator(mediatorObj);
    });
    return application;
  }
  /**
   * [mapToConstructor Takes a constructor's name as a string and returns its true
   * constructor to instatiate the tool or mediator.]
   * @param  {[String]} constructorName [Name of the tool or mediator's constructor]
   * @return {[Function]} [The constructor registered for the given name]
   */
  mapToConstructor(constructorName) {
    const ctr = this.registry[constructorName];
    if (!ctr) {
      // eslint-disable quotes
      const err = `"${constructorName}" is not a registered tool or mediator constructor.`;
      throw err;
    }
    return ctr;
  }
  /**
   * [createFromConstructorName Takes a constructor's name as a string and instatiates
   * an object using the constructor registered for that name.]
   * @param  {[String]} constructorName [Name of the tool or mediator's constructor]
   * @return {[Function]} [An instance of the constructor registered for the given name]
   */
  createFromConstructorName(constructorName, ...constructorArgs) {
    // eslint-disable new-cap
    return new (this.mapToConstructor(constructorName))(...constructorArgs);
  }
  /**
   * [registerConstructor Register a constructor's name as a
   * string to it's associated constructor function.]
   * @param  {[String]} constructorName
   * @param  {[Function]} toolConstructor [The class constructor of the tool.]
   */
  registerConstructor(constructorName, constructorFunction) {
    this.registry[constructorName] = constructorFunction;
  }
}
