const THREE = require('three');
const TrackBallControls = require('three-trackballcontrols');

export const ORTHOGRAPHIC = 'ORTHOGRAPHIC';
export const PERSPECTIVE = 'PERSPECTIVE';
export const TRACKBALL = 'TRACKBALL';


function mouseIntersectsViewport(mouse) {
  return Math.abs(mouse.x) < 1.0 && Math.abs(mouse.y) < 1.0;
}

/**
 * Primitive class for splitting the canvas into a viewport.
 */
export default class ViewPort {
  /**
   * [constructor Create a camera that renders
   * into a fraction of the threejs canvas]
   * @param  {[Number]} bottom [Offset from the bottom: 0.0 to 1.0]
   * @param  {[Number]} left   [Offset from the left: 0.0 to 1.0]
   * @param  {[Number]} width  [Width as a fraction: 0.0 to 1.0]
   * @param  {[Number]} height [Height as a fraction: 0.0 to 1.0]
   * @param {[String]} type [Either PERSPECTIVE or ORTHOGRAPHIC]
   */
  constructor(
    canvas,
    renderer,
    left,
    bottom,
    width,
    height,
    type,
    control,
    near = 0.1,
    far = 6000,
    enableControlsKeys = false,
  ) {
    const rectangle = canvas.getBoundingClientRect();
    this.enabled = true;
    this.canvas = canvas;
    this.renderer = renderer;
    this.canvasRectangle = rectangle;
    this.frustrumSize = height * rectangle.height;
    this.viewport = { bottom, left, width, height };
    this.mouse = new THREE.Vector2();
    this.lastMouseDown = new THREE.Vector2();
    this.lastMouseUp = new THREE.Vector2();
    this.clearColor = new THREE.Color().setRGB(1.0, 1.0, 1.0);
    this.pan = { x: 0, y: 0 };
    switch (type) {
      case PERSPECTIVE: {
        this.camera = new THREE.PerspectiveCamera();
        break;
      }
      case ORTHOGRAPHIC: {
        this.camera = new THREE.OrthographicCamera();
        break;
      }
      default: {
        // eslint-disable quotes
        const err = `Camera type must be either ${ORTHOGRAPHIC} or ${PERSPECTIVE}, not "${type}"`;
        throw err;
      }
    }
    switch (control) {
      case TRACKBALL: {
        this.controls = new TrackBallControls(this.camera, canvas);
        this.controls.rotateSpeed = 4.0;
        this.controls.dynamicDampingFactor = 1.0;
        if (!enableControlsKeys) {
          this.controls.keys = [];
        }
        break;
      }
      default: {
        break;
      }
    }
    this.setNear(near);
    this.setFar(far);
    this.camera.position.z = 5.0;
  }
  getTHREECamera() {
    return this.camera;
  }
  getTHREEControls() {
    return this.controls;
  }
  getMousePosReference() {
    return this.mouse;
  }
  getCameraAxes() {
    const camera = this.getTHREECamera();
    const zDir = camera.getWorldDirection().multiplyScalar(-1.0);
    const yDir = camera.up.clone();
    const xDir = new THREE.Vector3().crossVectors(yDir, zDir);
    return { xDir, yDir, zDir };
  }
  inversePan() {
    const camera = this.getTHREECamera();
    const { x, y } = this.getPan();
    const { xDir, yDir } = this.getCameraAxes();
    camera.position.sub(xDir.multiplyScalar(x)).sub(yDir.multiplyScalar(y));
  }
  applyPan() {
    const camera = this.getTHREECamera();
    const { x, y } = this.getPan();
    const { xDir, yDir } = this.getCameraAxes();
    const posOffset = new THREE.Vector3().addVectors(
      xDir.multiplyScalar(x),
      yDir.multiplyScalar(y),
    );
    camera.position.add(posOffset);
  }
  getPan() {
    return this.pan;
  }
  setPan(pan) {
    this.inversePan();
    this.pan = pan;
    this.applyPan();
  }
  rollBy(angle) {
    this.inversePan();
    const axis = this.camera.getWorldDirection().normalize().multiplyScalar(-1.0);
    this.camera.up.applyAxisAngle(axis, angle);
    this.applyPan();
  }
  setNear(near) {
    this.camera.near = near;
  }
  setFar(far) {
    this.camera.far = far;
  }
  setEnabled(boolean) {
    this.enabled = boolean;
  }
  setControlsEnabled(boolean) {
    if (this.controls) {
      this.controls.enabled = boolean;
    }
  }
  setClearColor(color) {
    this.clearColor = color;
  }
  resetControls() {
    if (this.controls) {
      const pos = this.camera.position.clone();
      pos.z = pos.length();
      pos.x = 0;
      pos.y = 0;
      this.controls.reset();
      this.camera.position.copy(pos);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }
  updateCamera(scene) {
    this.canvasRectangle = this.canvas.getBoundingClientRect();
    this.updateCameraConfiguration();
    this.renderWith(scene);
  }
  updateCameraConfiguration() {
    const { width, height } = this.canvasRectangle;
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.left = (-this.frustrumSize * aspect) / 2;
    this.camera.right = (this.frustrumSize * aspect) / 2;
    this.camera.top = this.frustrumSize / 2;
    this.camera.bottom = -this.frustrumSize / 2;
    this.camera.updateProjectionMatrix();
  }
  getViewportMousePosition(x, y, width, height, vec2Obj) {
    const viewportWidthPX = width * this.viewport.width;
    const viewportHeightPX = height * this.viewport.height;
    const yOffset = this.viewport.height - this.viewport.bottom;
    vec2Obj.set(
       ((2 * (((x - (width * this.viewport.left))) / viewportWidthPX)) - 1),
      -((2 * (((y - (height * yOffset))) / viewportHeightPX)) - 1),
    );
  }
  mouseIntersects() {
    return mouseIntersectsViewport(this.mouse);
  }
  updateMousePosition(x, y, width, height) {
    this.getViewportMousePosition(x, y, width, height, this.mouse);
  }
  updateLastMouseDownPosition(x, y, width, height) {
    this.getViewportMousePosition(x, y, width, height, this.lastMouseDown);
    if (this.controls) {
      if (this.controls.enabled && !mouseIntersectsViewport(this.lastMouseDown)) {
        this.setControlsEnabled(false);
      } else if (mouseIntersectsViewport(this.lastMouseDown)) {
        this.setControlsEnabled(this.enabled);
      }
    }
  }
  updateLastMouseUpPosition(x, y, width, height) {
    this.getViewportMousePosition(x, y, width, height, this.lastMouseUp);
    if (mouseIntersectsViewport(this.lastMouseUp)) {
      this.setControlsEnabled(true);
    }
  }
  renderWith(scene) {
    const { width, height } = this.canvasRectangle;
    this.renderer.setViewport(
      width * this.viewport.left,
      height * this.viewport.bottom,
      width * this.viewport.width,
      height * this.viewport.height,
    );
    this.renderer.setScissor(
      width * this.viewport.left,
      height * this.viewport.bottom,
      width * this.viewport.width,
      height * this.viewport.height,
    );
    this.renderer.setScissorTest(true);
    this.renderer.setClearColor(this.clearColor, 1);
    if (this.controls && this.controls.update) {
      this.controls.update();
    }
    this.renderer.render(scene, this.camera);
  }
}
