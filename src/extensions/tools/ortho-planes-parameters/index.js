import OrthoPlanesParametersWidget from './OrthoPlanesParametersWidget';

/**
 * OrthoPlanesParameters is a controller for updating the OrthoPlanes
 * given the input updates in the OrthoPlanesParametersWidget component.
 * If the scene is updated by other tools like PlaneShifter then inputs are re-updated
 * and callbacks are called to handle this event.
 * If the rotation is reset then callbacks are called in particular for
 * viewports to realign their orientation to the scene.
 */
export default class OrthoPlanesParameters {
  constructor(view) {
    this.sidebarWidget = OrthoPlanesParametersWidget;
    this.scene = view.scene;
    this.sceneUpdateCallbacks = [];
    this.rotationResetCallbacks = [];
  }
  onRotationReset(callback) {
    this.rotationResetCallbacks.push(callback);
  }
  getPlaneSystem() {
    return this.scene.getPlaneSystem();
  }
  serialize() {
    const serialized = {};
    { // serialize position
      const { x, y, z } = this.scene.getPlaneSystem().position;
      serialized.position = { x, y, z };
    }
    { // serialize rotation
      const { x, y, z } = this.scene.getPlaneSystem().rotation;
      serialized.rotation = { x, y, z };
    }
    return serialized;
  }
  deserialize(json) {
    const { position, rotation } = json;
    const system = this.scene.getPlaneSystem();
    system.position.set(position.x, position.y, position.z);
    system.rotation.set(rotation.x, rotation.y, rotation.z);
  }
}
