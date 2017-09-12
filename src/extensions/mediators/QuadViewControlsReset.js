import * as THREE from 'three';

const OFFSET = new THREE.Vector3(0, 10, 0);

export default function QuadViewControlsReset(camControls, camParams) {
  camParams.onResetControls(() => {
    camControls.resetControls(OFFSET);
  });
}
