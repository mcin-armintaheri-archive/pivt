const THREE = require('three');

class PlaneCameraAligner {
  constructor(viewport, plane, planeSystem, layer, camPosition) {
    this.camera = viewport.getTHREECamera();
    this.camera.position.copy(camPosition);
    this.plane = plane;
    this.planeSystem = planeSystem;
    this.quat0 = planeSystem.quaternion.clone().inverse();
    this.setLayer(layer);
    this.initialUp = this.plane.up.clone();
    this.plane.localToWorld(this.initialUp);
    this.resetCameraUp();
  }
  setLayer(layer) {
    this.camera.layers.enable(layer);
    this.camera.layers.set(layer);
    this.plane.layers.enable(layer);
  }
  updateCameraOrientation() {
    const dquat = this.planeSystem.quaternion.clone().multiply(this.quat0).normalize();
    const camToPlane = this.camera.position.clone();
    const rotatedCamToPlane = camToPlane.clone().applyQuaternion(dquat);
    this.camera.position.copy(rotatedCamToPlane);
    const unitCamToPlane = camToPlane.normalize();
    const unitRotated = rotatedCamToPlane.normalize();
    const upQuaternion = new THREE.Quaternion().setFromUnitVectors(unitCamToPlane, unitRotated);
    upQuaternion.normalize();
    this.camera.up.applyQuaternion(upQuaternion);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.quat0 = this.planeSystem.quaternion.clone().inverse();
  }
  resetCameraUp() {
    this.updateCameraOrientation();
    this.camera.up.copy(this.initialUp);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

export default class QuadViewXYZLayers {
  constructor(scene, layout, materialManager, planeParams) {
    this.orthoCameras = layout.getViewports().slice(0, 3).map(v => v.getTHREECamera());
    this.planesAreLoaded = false;
    this.threeScene = scene.getTHREEScene();
    this.threeScene.add(...this.orthoCameras);
    this.aligners = [];
    materialManager.onMaterialChange((material, dimensions) => {
      const { diagonal } = dimensions;
      this.threeScene.updateMatrixWorld(true);
      this.xyAligner = new PlaneCameraAligner(
        layout.getBottomLeft(),
        scene.getXY(),
        scene.getPlaneSystem(),
        1,
        new THREE.Vector3(0, 0, diagonal),
      );
      this.xzAligner = new PlaneCameraAligner(
        layout.getTopLeft(),
        scene.getXZ(),
        scene.getPlaneSystem(),
        2,
        new THREE.Vector3(0, diagonal, 0),
      );
      this.yzAligner = new PlaneCameraAligner(
        layout.getTopRight(),
        scene.getYZ(),
        scene.getPlaneSystem(),
        3,
        new THREE.Vector3(diagonal, 0, 0),
      );
      this.aligners = [this.xyAligner, this.xzAligner, this.yzAligner];
      layout.getBottomRight().moveTo(0, 0, 2 * diagonal);
      this.planesAreLoaded = true;
    });
    planeParams.onRotationReset(this.resetCameraUps.bind(this));
  }
  resetCameraUps() {
    this.aligners.forEach((aligner) => {
      aligner.resetCameraUp();
    });
  }
  render() {
    if (this.planesAreLoaded) {
      this.aligners.forEach((aligner) => {
        aligner.updateCameraOrientation();
      });
    }
  }
}
