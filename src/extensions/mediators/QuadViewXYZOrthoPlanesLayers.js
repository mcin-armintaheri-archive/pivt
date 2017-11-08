import R from 'ramda';

import * as THREE from 'three';

const ZERO = new THREE.Vector3(0, 0, 0);
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
    camera.lookAt(ZERO);
    this.viewport.applyPan();
  }
  rollDefaultUpBy(angle) {
    const { zDir } = this.viewport.getCameraAxes();
    const rotation = new THREE.Quaternion().setFromAxisAngle(zDir, angle).normalize();
    this.initialUp.applyQuaternion(rotation);
  }
}


class OrthoViewPlaneShifter {
  constructor(plane, camControls, planeSystem, boundingBox) {
    const viewport = camControls.getViewport();
    const mouse = viewport.getMousePosReference();
    const cam = viewport.getTHREECamera();
    const rayCaster = new THREE.Raycaster();
    let shiftMode = false;
    const movePlanesToMouse = (x, y, clickCode) => {
      if (clickCode === 0 && shiftMode) {
        rayCaster.setFromCamera(mouse, cam);
        const intersections = rayCaster.intersectObjects([plane]);
        if (intersections.length > 0 && boundingBox.containsPoint(intersections[0].point)) {
          planeSystem.position.copy(intersections[0].point);
        }
      }
    };
    camControls.withAction('mouseDownAction', (s, enabled, x, y, clickCode) => {
      if (enabled) {
        shiftMode = true;
        movePlanesToMouse(x, y, clickCode);
      }
    });
    camControls.withAction('mouseMoveAction', (_, enabled, x, y, clickCode) => {
      if (enabled) {
        movePlanesToMouse(x, y, clickCode);
      }
    });
    camControls.withAction('mouseUpAction', () => { shiftMode = false; });
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
  constructor(view, materialManager, camControls, planeParams, quadviewCameraAxes) {
    const { scene, layout } = view;
    this.orthoCameras = layout.getViewports().slice(0, 3).map(v => v.getTHREECamera());
    this.planesAreLoaded = false;
    this.threeScene = scene.getTHREEScene();
    this.planeSystem = scene.getPlaneSystem();
    this.threeScene.add(...this.orthoCameras);
    this.aligners = [];
    this.axisSystems = [];
    planeParams.onRotationReset(this.resetCameraUps.bind(this));
    materialManager.onMaterialChange((shaderManager) => {
      scene.getPlaneSystem().position.set(0, 0, 0);
      scene.getPlaneSystem().rotation.set(0, 0, 0);
      const diagonal = shaderManager.getDiagonal();
      if (!diagonal) {
        return;
      }
      const camRadius = diagonal * 0.5;
      this.threeScene.updateMatrixWorld(true);
      const viewportControls = camControls.getOrthoControls();
      const planeCamConfigs = [
        {
          viewport: viewportControls[0].getViewport(),
          controls: viewportControls[0],
          plane: scene.getXY(),
          layer: 1,
          cameraPosition: new THREE.Vector3(0, 0, camRadius)
        },
        {
          viewport: viewportControls[1].getViewport(),
          controls: viewportControls[1],
          plane: scene.getXZ(),
          layer: 2,
          cameraPosition: new THREE.Vector3(0, -camRadius, 0)
        },
        {
          viewport: viewportControls[2].getViewport(),
          controls: viewportControls[2],
          plane: scene.getYZ(),
          layer: 3,
          cameraPosition: new THREE.Vector3(camRadius, 0, 0)
        }
      ];
      planeCamConfigs.forEach((config) => {
        config.viewport.setPan({ x: 0, y: 0 });
      });
      this.aligners = planeCamConfigs.map(config => new PlaneCameraAligner(
        config.viewport,
        config.plane,
        this.planeSystem,
        config.layer,
        config.cameraPosition
      ));
      this.orthoShifters = planeCamConfigs.map(config => new OrthoViewPlaneShifter(
        config.plane,
        config.controls,
        this.planeSystem,
        scene.getBoundingBox()
      ));
      this.axisSystems.filter(R.identity).forEach((axes) => {
        axes.dispose();
      });
      const resetPosition = new THREE.Vector3().set(0, 10, diagonal);
      const perspRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI / 2
      );
      const trackballControls = camControls.getTrackballControls();
      trackballControls.setResetPosition(resetPosition);
      trackballControls.setQuaternionOffset(perspRotation);
      trackballControls.resetControls();
      // Fix YZ camera orientation.
      this.resetCameraUps();
      this.aligners[2].rollDefaultUpBy(Math.PI / 2);
      this.resetCameraUps();
      /*
        If the QuadViewCameraAxes tool is bundled with the application,
        create the axes for each orthographic camera.
       */
      if (quadviewCameraAxes) {
        const thickness = 0.6;
        quadviewCameraAxes.dispose();
        if (shaderManager.getMRIs().length === 1) {
          quadviewCameraAxes.createParentedAxes(
            layout.getBottomRight(),
            this.planeSystem,
            diagonal,
            thickness,
            0.5,
            [0, 1, 2, 3]
          );
        }
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
