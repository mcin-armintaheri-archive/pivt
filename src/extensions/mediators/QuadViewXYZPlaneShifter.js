import { PlaneShifter } from 'PlaneShifter';

const THREE = require('three');

export default class QuadViewXYZPlaneShifter {
  constructor(scene, layout, materialManager) {
    materialManager.onMaterialChange((mat, dimensions) => {
      this.planeshifter = new PlaneShifter(
        scene.getSystem(),
        layout.getBottomRight().getTHREECamera(),
        {
          controls: layout.getBottomRight().getTHREEControls(),
          mouse: layout.getBottomRight().getMousePosReference(),
        },
      );
      const { x, y, z } = dimensions;
      this.planeshifter.setBoundingBox(
        new THREE.Box3(
          new THREE.Vector3(-x / 2, -y / 2, -z / 2),
          new THREE.Vector3(x / 2, y / 2, z / 2)),
      );
    });
  }
}
