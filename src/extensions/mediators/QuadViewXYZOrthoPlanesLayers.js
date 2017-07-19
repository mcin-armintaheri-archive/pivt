import R from 'ramda';

const THREE = require('three');

/**
 * PlaneCameraAligner associated a viewport with a particular plane in
 * OrthoPlanes. The aligner makes the camera in the viewport rotate and move with the
 * plane in a matter that provides the user with a continuous orientation
 * with the plane.
 */
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
  /**
   * Using the plane system's change in orientation, find where the new position
   * of the camera should be by taking the unpanned position of the camera
   * relative to the plane system and rotate it by the change in oriantation.
   * Take the new position and the hold position and find the quaternion that
   * transforms the intial position to the new position. This quaternion is needed
   * to remove the rolling of the plane system's quaternion. This quaternion is
   * used to apply a smooth rotation to the camera's up vector. The camera's pan
   * is then reapplied.
   */
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
  /**
   * Reset the up of the cameras to the initial up when the camera was intially fixed to the plane.
   */
  resetCameraUp() {
    const camera = this.viewport.getTHREECamera();
    this.viewport.inversePan();
    this.updateCameraOrientation();
    camera.up.copy(this.initialUp);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.viewport.applyPan();
  }
}

/**
 * QuadViewXYZLayers forces the orthographic cameras to only view the planes and axes
 * they are associated with. It also defines the associations themselves. When the
 * plane rotations are reset by OrthoPlanesParameters, the camera up vectors are
 * all reset.
 * @param  {OrthoPlanes} scene
 * @param  {XYZPerspectiveQuadView} layout
 * @param  {PlanesMaterialManager} materialManager
 * @param  {OrthoPlanesParameters} planeParams
 * @param  {QuadViewCameraAxes} quadviewCameraAxes
 */
export default class QuadViewXYZOrthoPlanesLayers {
  constructor(view, materialManager, planeParams, quadviewCameraAxes) {
    const { scene, layout } = view;
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
      planeCamConfigs.forEach((config) => {
        config.viewport.setPan({ x: 0, y: 0 });
      });
      this.aligners = planeCamConfigs.map(config => new PlaneCameraAligner(
        config.viewport,
        config.plane,
        scene.getPlaneSystem(),
        config.layer,
        config.cameraPosition,
      ));
      this.axisSystems.filter(R.identity).forEach((axes) => {
        axes.dispose();
      });

      layout.getBottomRight().getTHREECamera().position.set(0, 10, 2 * diagonal);
      layout.getBottomRight().resetControls(new THREE.Vector3(0, 10, 0));
      /*
        If the QuadViewCameraAxes tool is bundled with the application,
        create the axes for each orthographic camera.
       */
      if (quadviewCameraAxes) {
        const thickness = 1;
        this.axisSystems = planeCamConfigs.map(config => quadviewCameraAxes.createProjectedAxes(
            config.viewport,
            config.plane,
            diagonal * 10,
            thickness,
            config.layer,
        ));
        quadviewCameraAxes.createFixedAxes(
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
  update() {
    if (this.planesAreLoaded) {
      this.aligners.forEach((aligner) => {
        aligner.updateCamera();
      });
    }
  }
}
