const THREE = require('three');

const setupLayer = (plane, viewport, layer, diagonal) => {
  const cam = viewport.getTHREECamera();
  plane.add(cam);
  cam.layers.enable(layer);
  cam.layers.set(layer);
  plane.layers.enable(layer);
  cam.position.set(0, 0, diagonal);
  cam.lookAt(new THREE.Vector3(0, 0, 0));
};

export default function QuadViewXYZLayers(scene, layout, materialManager) {
  materialManager.onMaterialChange((material, dimensions) => {
    const { diagonal } = dimensions;
    scene.getPlanes().forEach(p => layout.getViewports().forEach(v => p.remove(v)));
    setupLayer(scene.getXY(), layout.getBottomLeft(), 1, diagonal);
    setupLayer(scene.getXZ(), layout.getTopLeft(), 2, diagonal);
    setupLayer(scene.getYZ(), layout.getTopRight(), 3, diagonal);
  });
}
