import OrthoPlanesParametersWidget from './OrthoPlanesParametersWidget';

export default class OrthoPlanesParameters {
  constructor(scene) {
    this.sidebarWidget = OrthoPlanesParametersWidget;
    this.scene = scene;
    this.sceneUpdateCallbacks = [];
  }
  setPlanePos(x, y, z) {
    this.scene.getPlaneSystem().position.set(x, y, z);
  }
  setPlaneRot(x, y, z, rads = false) {
    const rate = rads ? 1.0 : Math.PI / 180.0;
    this.scene.getPlaneSystem().rotation.set(x * rate, y * rate, z * rate);
  }
  updateFromScene() {
    const { position, rotation } = this.scene.getPlaneSystem();
    this.sceneUpdateCallbacks.forEach((f) => { f(position, rotation); });
  }
  onSceneUpdate(callback) {
    this.sceneUpdateCallbacks.push(callback);
  }
}
