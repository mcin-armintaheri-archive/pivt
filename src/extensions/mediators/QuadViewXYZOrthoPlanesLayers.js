const THREE = require('three');

class PlaneCameraAligner {
  constructor(viewport, plane, planeSystem, layer, camPosition) {
    this.viewport = viewport;
    viewport.getTHREECamera().position.copy(camPosition);
    this.plane = plane;
    this.planeSystem = planeSystem;
    this.quat0 = planeSystem.quaternion.clone().inverse();
    this.setLayer(layer);
    this.initialUp = this.plane.up.clone();
    this.plane.localToWorld(this.initialUp);
    this.resetCameraUp();
  }
  setLayer(layer) {
    const camera = this.viewport.getTHREECamera();
    camera.layers.set(layer);
    this.plane.layers.enable(layer);
  }
  updateCameraOrientation() {
    const camera = this.viewport.getTHREECamera();
    const dQuaternion = this.planeSystem.quaternion.clone().multiply(this.quat0).normalize();
    const camToPlane = camera.position.clone();
    const rotatedCamToPlane = camToPlane.clone().applyQuaternion(dQuaternion);
    camera.position.copy(rotatedCamToPlane);
    const unitCamToPlane = camToPlane.normalize();
    const unitRotated = rotatedCamToPlane.normalize();
    const upQuaternion = new THREE.Quaternion().setFromUnitVectors(unitCamToPlane, unitRotated);
    upQuaternion.normalize();
    camera.up.applyQuaternion(upQuaternion);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.quat0 = this.planeSystem.quaternion.clone().inverse();
  }
  updateCamera() {
    this.viewport.inversePan();
    this.updateCameraOrientation();
    this.viewport.applyPan();
  }
  resetCameraUp() {
    const camera = this.viewport.getTHREECamera();
    this.viewport.inversePan();
    this.updateCameraOrientation();
    camera.up.copy(this.initialUp);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.viewport.applyPan();
  }
}

export default class QuadViewXYZLayers {
  constructor(scene, layout, materialManager, planeParams, quadviewCameraAxes) {
    this.orthoCameras = layout.getViewports().slice(0, 3).map(v => v.getTHREECamera());
    this.planesAreLoaded = false;
    this.threeScene = scene.getTHREEScene();
    this.threeScene.add(...this.orthoCameras);
    this.aligners = [];
    this.axisSystems = [];
    planeParams.onRotationReset(this.resetCameraUps.bind(this));
    materialManager.onMaterialChange((material, dimensions) => {
      const { diagonal } = dimensions;
      this.threeScene.updateMatrixWorld(true);
      const planeCamConfigs = [
        {
          viewport: layout.getBottomLeft(),
          plane: scene.getXY(),
          layer: 1,
          cameraPosition: new THREE.Vector3(0, 0, diagonal),
        },
        {
          viewport: layout.getTopLeft(),
          plane: scene.getXZ(),
          layer: 2,
          cameraPosition: new THREE.Vector3(0, diagonal, 0),
        },
        {
          viewport: layout.getTopRight(),
          plane: scene.getYZ(),
          layer: 3,
          cameraPosition: new THREE.Vector3(diagonal, 0, 0),
        },
      ];
      this.aligners = planeCamConfigs.map(config => new PlaneCameraAligner(
        config.viewport,
        config.plane,
        scene.getPlaneSystem(),
        config.layer,
        config.cameraPosition,
      ));
      this.axisSystems.forEach((axes) => {
        axes.dispose();
      });

      layout.getBottomRight().getTHREECamera().position.set(0, 10, 2 * diagonal);
      /*
        If the QuadViewCameraAxes tool is bundled with the application,
        create the axes for each orthographic camera.
       */
      if (quadviewCameraAxes) {
        const thickness = 1;
        this.axisSystems = planeCamConfigs.map(config => quadviewCameraAxes.createAxes(
            config.viewport,
            config.plane,
            diagonal * 10,
            thickness,
            config.layer,
        ));
        quadviewCameraAxes.createAxes(
          layout.getBottomRight(),
          new THREE.Vector3(0, 0, 0),
          diagonal * 10,
          thickness,
          0,
        );
      }
      this.planesAreLoaded = true;
    });
  }
  resetCameraUps() {
    this.aligners.forEach((aligner) => {
      aligner.resetCameraUp();
    });
  }
  render() {
    if (this.planesAreLoaded) {
      this.aligners.forEach((aligner) => {
        aligner.updateCamera();
      });
    }
  }
}
