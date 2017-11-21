import * as THREE from 'three';
import VolumeInfoWindow from './VolumeInfoWindow';
import VolumeInfoSidebarWidget from './VolumeInfoSidebarWidget';

export default class VolumeInfo {
  constructor(view) {
    const { scene, layout } = view;
    this.scene = scene;
    this.layout = layout;
    this.sidebarWidget = VolumeInfoSidebarWidget;
    this.windowConfig = {
      widget: VolumeInfoWindow,
      title: 'Volume Information',
      openPosition: { x: 0.70, y: 0.02, viewportCoords: true },
      open: false
    };
    this.raycaster = new THREE.Raycaster();
    this.hoverPositionWorld = new THREE.Vector3();
    this.segmentDisplacement = new THREE.Vector3();
    this.segmentDistanceWorld = 0;
    this.listeners = { mousemove: () => this.mouseMove() };
    window.addEventListener('mousemove', this.listeners.mousemove);
  }
  mouseMove() {
    let hit = null;
    this.layout.getViewports().forEach((viewport) => {
      const cam = viewport.getTHREECamera();
      const mouse = viewport.getMousePosReference();
      this.raycaster.setFromCamera(mouse, cam);
      const intersects = this.raycaster.intersectObjects(this.scene.getPlaneSystem().children)
        .filter(h => this.scene.getBoundingBox().containsPoint(h.point));
      if (intersects.length > 0) {
        hit = intersects[0];
      }
    });
    if (hit) {
      this.hoverPositionWorld.copy(hit.point);
    }
  }
  setShaderManager(shaderManager) {
    this.overlays = shaderManager.getMRIs();
  }
  setLineSegment(begin, end) {
    this.segmentDisplacement.subVectors(end, begin);
    this.segmentDistanceWorld = this.segmentDisplacement.length();
  }
  dispose() {
    window.removeEventListener('mousemove', this.listeners.movemouse);
  }
}
