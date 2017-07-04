import { PlaneShifter } from 'PlaneShifter';

export default function QuadViewXYZPlaneShifter(scene, layout, materialManager, planeParams) {
  const perspCam = layout.getBottomRight();
  materialManager.onMaterialChange(() => {
    this.planeshifter = new PlaneShifter(
      scene.getPlaneSystem(),
      perspCam.getTHREECamera(),
      {
        mouse: perspCam.getMousePosReference(),
      },
    );
    this.planeshifter.on('startInteraction', () => {
      perspCam.setEnabled(false);
    });
    this.planeshifter.on('stopInteraction', () => {
      perspCam.setEnabled(true);
      planeParams.updateFromScene();
    });
    this.planeshifter.setBoundingBox(scene.getBoundingBox());
  });
}
