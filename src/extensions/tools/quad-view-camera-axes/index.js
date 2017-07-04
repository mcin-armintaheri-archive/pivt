import { VERTEX, FRAGMENT } from './DashedShader';
import QuadViewCameraAxesWidget from './QuadViewCameraAxesWidget';

const THREE = require('three');

function createXYZLines(radius) {
  const xLine = new THREE.LineCurve3(
    new THREE.Vector3(-radius, 0, 0),
    new THREE.Vector3(radius, 0, 0),
  );
  const yLine = new THREE.LineCurve3(
    new THREE.Vector3(0, -radius, 0),
    new THREE.Vector3(0, radius, 0),
  );
  const zLine = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, -radius),
    new THREE.Vector3(0, 0, radius),
  );
  return [
    {
      path: xLine,
      color: { r: 0, g: 1, b: 1 },
    },
    {
      path: yLine,
      color: { r: 1, g: 0, b: 1 },
    },
    {
      path: zLine,
      color: { r: 1, g: 1, b: 0 },
    },
  ];
}

class CameraAxes {
  constructor(viewport, target, size, thickness, layer, dashLength) {
    this.viewport = viewport;
    this.target = target;
    this.projPlane = new THREE.Plane();
    this.system = new THREE.Object3D();
    this.system.add(...createXYZLines(size / 2).map(line => new THREE.Mesh(
      new THREE.TubeGeometry(line.path, 10, thickness, 24, true),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: {
          r: {
            type: 'f',
            value: line.color.r,
          },
          g: {
            type: 'f',
            value: line.color.g,
          },
          b: {
            type: 'f',
            value: line.color.b,
          },
          dashLength: {
            type: 'f',
            value: dashLength,
          },
        },
      }),
    )));
    this.system.layers.set(layer);
    this.system.children.forEach((child) => {
      child.layers.set(layer);
    });
    if (this.target instanceof THREE.Vector3) {
      this.system.position.copy(this.target);
    }
  }
  projectAxes() {
    // Don't project if axes are positioned at a fixed point.
    if (this.target instanceof THREE.Vector3) {
      return;
    }
    const camera = this.viewport.getTHREECamera();
    this.projPlane.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection().multiplyScalar(-1.0),
      this.target.position,
    );
    const axesPos = this.projPlane.projectPoint(camera.position);
    this.system.position.copy(axesPos);
  }
  getAxisSystem() {
    return this.system;
  }
  showAxes(boolean) {
    this.system.children.forEach((axis) => {
      Object.assign(axis, { visible: boolean });
    });
  }
}

export default class QuadViewCameraAxes {
  constructor(scene) {
    this.sidebarWidget = QuadViewCameraAxesWidget;
    this.scene = scene;
    this.cameraAxesList = [];
  }
  showAxes(boolean) {
    this.cameraAxesList.forEach((axes) => {
      axes.showAxes(boolean);
    });
  }
  createAxes(viewport, target, size, thickness, layer = 0, dashLength = 10) {
    const cameraAxes = new CameraAxes(
      viewport,
      target,
      size,
      thickness,
      layer,
      dashLength,
    );
    this.scene.getTHREEScene().add(cameraAxes.getAxisSystem());
    this.cameraAxesList.push(cameraAxes);
  }
  dispose() {
    this.scene.remove(...this.cameraAxesList.map(axes => axes.getAxisSystem()));
    this.cameraAxesList = [];
  }
  update() {
    this.cameraAxesList.forEach((axes) => {
      axes.projectAxes();
    });
  }
}
