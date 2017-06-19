import OrthoPlanesParametersWidget from './OrthoPlanesParametersWidget';

export default class OrthoPlanesParameters {
  constructor(scene) {
    this.sidebarWidget = OrthoPlanesParametersWidget;
    this.scene = scene;
  }
  setPlanePos(x, y, z) {
    this.scene.getPlaneSystem().position.set(x, y, z);
  }
  setPlaneRot(x, y, z) {
    const rate = Math.PI / 180;
    this.scene.getPlaneSystem().rotation.set(x * rate, y * rate, z * rate);
  }
}
