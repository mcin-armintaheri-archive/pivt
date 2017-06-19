const setupLayer = (plane, viewport, layer, diagonal, scene) => {
  const cam = viewport.getTHREECamera();
  cam.layers.enable(layer);
  cam.layers.set(layer);
  plane.layers.enable(layer);
  viewport.lookAt(scene.getCameraSystem().position);
};

export default function QuadViewXYZLayers(scene, layout, materialManager) {
  const orthoCameras = layout.getViewports().slice(0, 3).map(v => v.getTHREECamera());
  scene.getCameraSystem().add(...orthoCameras);
  materialManager.onMaterialChange((material, dimensions) => {
    const { diagonal } = dimensions;

    layout.getBottomLeft().moveTo(0, 0, diagonal);
    setupLayer(scene.getXY(), layout.getBottomLeft(), 1, diagonal, scene);

    layout.getTopLeft().moveTo(0, diagonal, 0);
    setupLayer(scene.getXZ(), layout.getTopLeft(), 2, diagonal, scene);

    layout.getTopRight().moveTo(diagonal, 0, 0);
    setupLayer(scene.getYZ(), layout.getTopRight(), 3, diagonal, scene);

    layout.getBottomRight().moveTo(0, 0, 2 * diagonal);
  });

  this.render = () => {
    scene.getCameraSystem().quaternion.copy(scene.getPlaneSystem().quaternion);
  };
}
