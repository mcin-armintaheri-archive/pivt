import { PlaneShifter } from 'PlaneShifter';

/* eslint-disable no-param-reassign */

/**
 * QuadViewXYZPlaneShifter uses the PlaneShifter package to bind the OrthoPlanes planes
 * into PlaneShifter and disable the perspective viewport with the user is attemping
 * to interact using PlaneShifter. When the interaction is over the inputs of
 * OrthoPlanesParameters is updated.
 * @param       {OrthoPlanes} scene
 * @param       {XYZPerspectiveQuadView} layout
 * @param       {PlanesMaterialManager} materialManager
 * @param       {OrthoPlanesParameters} planeParams
 * @constructor
 */
export default function QuadViewXYZOrthoPlanesShifter(
  view,
  camControls,
  materialManager
) {
  const { scene, layout } = view;
  const perspCam = layout.getBottomRight();
  materialManager.onMaterialChange(() => {
    this.planeshifter = new PlaneShifter(
      scene.getPlaneSystem(),
      perspCam.getTHREECamera(),
      {
        mouse: perspCam.getMousePosReference()
      }
    );
    this.planeshifter.on('startInteraction', () => {
      camControls.getViewportControls().forEach((c) => { c.setEnabled(false); });
    });
    this.planeshifter.on('stopInteraction', () => {
      camControls.getViewportControls().forEach((c) => { c.setEnabled(true); });
    });
    this.planeshifter.setBoundingBox(scene.getBoundingBox());
  });
}
