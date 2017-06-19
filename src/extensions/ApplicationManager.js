import Application from './Application';

// Begin Tool and Mediator Imports
import CurveTool from './tools/curve-tool/';
import XYZPerspectiveQuadView from './view-layout/XYZPerspectiveQuadView';
import OrthoPlanes from './scene/OrthoPlanes';
import OrthoPlanesShaderInjector from './mediators/OrthoPlanesShaderInjector';
import QuadViewXYZLayers from './mediators/QuadViewXYZLayers';
import QuadViewXYZPlaneShifter from './mediators/QuadViewXYZPlaneShifter';
import OrthoPlanesContrastSettings from './mediators/OrthoPlanesContrastSettings';
import PlanesMaterialManager from './tools/planes-material-manager';
import OrthoPlanesParameters from './tools/ortho-planes-parameters';
// End Tool and Mediator Imports

export default class ApplicationManager {
  constructor() {
    this.registry = {};
    this.registerConstructor('CurveTool', CurveTool);
    this.registerConstructor('OrthoPlanes', OrthoPlanes);
    this.registerConstructor('XYZPerspectiveQuadView', XYZPerspectiveQuadView);
    this.registerConstructor('OrthoPlanesShaderInjector', OrthoPlanesShaderInjector);
    this.registerConstructor('QuadViewXYZLayers', QuadViewXYZLayers);
    this.registerConstructor('QuadViewXYZPlaneShifter', QuadViewXYZPlaneShifter);
    this.registerConstructor('OrthoPlanesContrastSettings', OrthoPlanesContrastSettings);
    this.registerConstructor('PlanesMaterialManager', PlanesMaterialManager);
    this.registerConstructor('OrthoPlanesParameters', OrthoPlanesParameters);
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
    const sceneObj = this.createFromConstructorName(scene, viewContainer);
    const layoutObj = this.createFromConstructorName(layout, viewContainer, renderer);
    dependencies.scene = sceneObj;
    application.setScene(sceneObj);
    dependencies.layout = layoutObj;
    application.setLayout(layoutObj);
    tools.forEach((toolMeta) => {
      const toolObj = this.createFromConstructorName(toolMeta.tool, sceneObj, layoutObj);
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
