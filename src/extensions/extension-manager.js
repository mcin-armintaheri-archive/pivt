import CurveTool from './tools/curve-tool';

export default class ExtensionManager {
  constructor() {
    this.registerConstructor('CurveTool', CurveTool);
  }
  /**
   * [createExtension Build an extension out of a JSON description]
   * The description of the extension is formatted as follows:
   * ExtensionJSON = {
   *  'name': 'myNewVisualization', #The name is a camel-cased string.
   *  'scene': 'orthoPlaneBrainSlicer', #The name of the scene constructor.
   *  'layout': 'xyzPerspectiveQuadView', #The name of the camera layout constructor.
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
   * @param  {[JSON]} jsonDescription [JSON-serializable description of the extension]
   * @return {[Extension]} [A running instantiation of the extension's description]
   */
  createExtension(jsonDescription) {
    this.placeholder = jsonDescription;
  }
  /**
   * [mapToConstructor Takes a constructor's name as a string and returns its true
   * constructor to instatiate the tool or mediator.]
   * @param  {[String]} constructorName [Name of the tool or mediator's constructor]
   * @return {[Function]} [The extension's constructor for the given name]
   */
  mapToConstructor(constructorName) {
    const ctr = this.registry[constructorName] || null;
    return ctr;
  }
  /**
   * [registerConstructor Register a constructor's name as a
   * string to it's associated constructor function.]
   * @param  {[String]} extensionName
   * @param  {[Function]} toolConstructor [The class constructor of the tool.]
   */
  registerConstructor(constructorName, constructorFunction) {
    this.registry[constructorName] = constructorFunction;
  }
}
