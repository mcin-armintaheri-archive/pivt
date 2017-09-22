import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './DashedShader';
import QuadViewCameraAxesWidget from './QuadViewCameraAxesWidget';

const ZERO = new THREE.Vector3(0, 0, 0);

/**
 * create the lines and colors of an XYZ axis system bounded in a sphere.
 * @param  {Number} radius bounding sphere radius.
 * @return {Object} Object holding threejs curves and colors for each axis.
 */
function createXYZLines(radius) {
  const xLine = new THREE.LineCurve3(
    new THREE.Vector3(-radius, 0, 0),
    new THREE.Vector3(radius, 0, 0)
  );
  const yLine = new THREE.LineCurve3(
    new THREE.Vector3(0, -radius, 0),
    new THREE.Vector3(0, radius, 0)
  );
  const zLine = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, -radius),
    new THREE.Vector3(0, 0, radius)
  );
  return [
    {
      path: xLine,
      color: { r: 0, g: 1, b: 1 }
    },
    {
      path: yLine,
      color: { r: 1, g: 0, b: 1 }
    },
    {
      path: zLine,
      color: { r: 1, g: 1, b: 0 }
    }
  ];
}

/**
 * Given a viewport and a target scene Object or THREE.Vector3, CameraAxes
 * will project an axis system to the viewing plane containing the target position.
 * If the target is a THREE.Vector3 the axes are simply placed at that position.
 */
class CameraAxes {
  constructor(viewport, size, thickness, layers, dashLength) {
    this.viewport = viewport;
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
            value: line.color.r
          },
          g: {
            type: 'f',
            value: line.color.g
          },
          b: {
            type: 'f',
            value: line.color.b
          },
          dashLength: {
            type: 'f',
            value: dashLength
          }
        }
      })
    )));
    const firstLayer = layers[0] === undefined ? 0 : layers[0];
    const restLayers = layers.slice(1, layers.length);
    this.system.layers.set(firstLayer);
    restLayers.forEach((l) => { this.system.layers.enable(l); });
    this.system.children.forEach((child) => {
      child.layers.set(firstLayer);
      restLayers.forEach((l) => { child.layers.enable(l); });
    });
  }
  getAxisSystem() {
    return this.system;
  }
  /**
   * Traverse the axes of the axis system and set their visibility to the given
   * boolean.
   * @param  {boolean} boolean visibility
   */
  showAxes(boolean) {
    this.system.children.forEach((axis) => {
      Object.assign(axis, { visible: boolean });
    });
  }
}

class CameraAxesProjected extends CameraAxes {
  constructor(viewport, target, size, thickness, layer, dashLength) {
    super(viewport, size, thickness, layer, dashLength);
    this.target = target;
    this.projPlane = new THREE.Plane();
  }
  /**
   * If the target is an object, project the camera's position to the viewing plane
   * at that object and render axes at that location.
   */
  projectAxes() {
    const camera = this.viewport.getTHREECamera();
    this.projPlane.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection().multiplyScalar(-1.0),
      this.target.position
    );
    const axesPos = this.projPlane.projectPoint(camera.position);
    this.system.position.copy(axesPos);
  }
}

class CameraAxesFixed extends CameraAxes {
  constructor(viewport, position, size, thickness, layer, dashLength) {
    super(viewport, size, thickness, layer, dashLength);
    this.system.position.copy(position);
  }
}

/**
 * QuadViewCameraAxes creates projected axes systems for the orthographic views
 * of a QuadView layout and a fixed axes sytem for the perspected view.
 */
export default class QuadViewCameraAxes {
  constructor(view) {
    this.sidebarWidget = QuadViewCameraAxesWidget;
    this.scene = view.scene;
    this.cameraAxesList = [];
  }
  showAxes(boolean) {
    this.cameraAxesList.forEach((axes) => {
      axes.showAxes(boolean);
    });
  }
  /**
   * Factory method for constructing projected camera axis systems.
   * @param  {ViewPort} viewport
   * @param  {THREE.Object3D} target
   * @param  {Number} size radius of bounding sphere of the axes
   * @param  {Number} thickness thickness of axis lines
   * @param  {Number} [layer=0] scene layer for filtering to cameras
   * @param  {Number} [dashLength=10] length of axes dashes in negative direction.
   */
  createProjectedAxes(viewport, target, size, thickness, layers = [0], dashLength = 10) {
    const cameraAxes = new CameraAxesProjected(
      viewport,
      target,
      size,
      thickness,
      layers,
      dashLength
    );
    this.scene.getTHREEScene().add(cameraAxes.getAxisSystem());
    this.cameraAxesList.push(cameraAxes);
  }
  /**
   * Factory method for constructing fixed camera axis systems.
   * @param  {ViewPort} viewport
   * @param  {THREE.Vector} position
   * @param  {Number} size radius of bounding sphere of the axes
   * @param  {Number} thickness thickness of axis lines
   * @param  {Number} [layer=0] scene layer for filtering to cameras
   * @param  {Number} [dashLength=10] length of axes dashes in negative direction.
   */
  createFixedAxes(viewport, position, size, thickness, layers = [0], dashLength = 10) {
    const cameraAxes = new CameraAxesFixed(
      viewport,
      position,
      size,
      thickness,
      layers,
      dashLength
    );
    this.scene.getTHREEScene().add(cameraAxes.getAxisSystem());
    this.cameraAxesList.push(cameraAxes);
  }
  createParentedAxes(viewport, target, size, thickness, layers = [0], dashLength = 10) {
    const cameraAxes = new CameraAxesFixed(
      viewport,
      ZERO,
      size,
      thickness,
      layers,
      dashLength
    );
    target.add(cameraAxes.getAxisSystem());
    this.cameraAxesList.push(cameraAxes);
  }
  /**
   * Destroy all axis systems
   */
  dispose() {
    this.scene.getTHREEScene().remove(...this.cameraAxesList.map(axes => axes.getAxisSystem()));
    this.cameraAxesList = [];
  }
  update() {
    this.cameraAxesList.forEach((axes) => {
      if (axes.projectAxes) {
        axes.projectAxes();
      }
    });
  }
}
