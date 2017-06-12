const THREE = require('three');

const setupLayer = (plane, viewport, layer) => {
  const cam = viewport.getTHREECamera();
  plane.add(cam);
  cam.layers.enable(layer);
  plane.layers.set(layer);
  cam.lookAt(new THREE.Vector3(0, 0, 0));
};

export default function QuadViewXYZLayers(scene, layout) {
  scene.getPlanes().forEach(p => layout.getViewports().forEach(v => p.remove(v)));
  setupLayer(scene.getYZ(), layout.getBottomLeft(), 1);
  setupLayer(scene.getXY(), layout.getTopLeft(), 2);
  setupLayer(scene.getXZ(), layout.getTopRight(), 3);
}
