import { PlaneShifter } from 'PlaneShifter';

const THREE = require('three');

export default class QuadViewXYZPlaneShifter {
  constructor(scene, layout, materialManager) {
    const perspCam = layout.getBottomRight();
    materialManager.onMaterialChange((mat, dimensions) => {
      this.planeshifter = new PlaneShifter(
        scene.getSystem(),
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
      });
      const { x, y, z } = dimensions;
      this.planeshifter.setBoundingBox(
        new THREE.Box3(
          new THREE.Vector3(-x / 2, -y / 2, -z / 2),
          new THREE.Vector3(x / 2, y / 2, z / 2)),
      );
    });
  }
}
