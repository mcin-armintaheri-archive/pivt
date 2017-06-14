const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

export const ORTHOGRAPHIC = 'ORTHOGRAPHIC';
export const PERSPECTIVE = 'PERSPECTIVE';
export const ORBIT = 'ORBIT';
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
  ) {
    const rectangle = canvas.getBoundingClientRect();
    this.canvas = canvas;
    this.renderer = renderer;
    this.canvasRectangle = rectangle;
    this.frustrumSize = height * rectangle.height;
    this.viewport = { bottom, left, width, height };
    this.mouse = new THREE.Vector2();
    this.clearColor = new THREE.Color().setRGB(1.0, 1.0, 1.0);
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
      case ORBIT: {
        this.controls = new OrbitControls(this.camera, canvas);
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
  setNear(near) {
    this.camera.near = near;
  }
  setFar(far) {
    this.camera.far = far;
  }
  enableControls(boolean) {
    if (this.controls) {
      if (boolean) {
        this.controls.reset();
      } else {
        this.controls.saveState();
      }
      this.controls.enabled = boolean;
    }
  }
  setClearColor(color) {
    this.clearColor = color;
  }
  moveTo(x = null, y = null, z = null) {
    if (x !== null) { this.camera.position.x = x; }
    if (y !== null) { this.camera.position.x = y; }
    if (z !== null) { this.camera.position.x = z; }
  }
  lookAt(position) {
    this.camera.lookAt(position);
  }
  followObject(sceneObject, offset, roll) {
    this.rollTo(roll);
  }
  rollTo(angle) {
    this.camera.up.x = Math.sin(angle);
    this.camera.up.y = Math.cos(angle);
    this.camera.up.normalize();
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
    this.camera.left = (-this.frustrumSize * aspect) / 4;
    this.camera.right = (this.frustrumSize * aspect) / 4;
    this.camera.top = this.frustrumSize / 2;
    this.camera.bottom = -this.frustrumSize / 2;
    this.camera.updateProjectionMatrix();
  }
  updateMousePosition(x, y, width, height) {
    const viewportWidthPX = width * this.viewport.width;
    const viewportHeightPX = height * this.viewport.height;
    const yOffset = this.viewport.height - this.viewport.bottom;
    this.mouse.set(
       ((2 * (((x - (width * this.viewport.left))) / viewportWidthPX)) - 1),
      -((2 * (((y - (height * yOffset))) / viewportHeightPX)) - 1),
    );
  }
  mouseIntersects() {
    return Math.abs(this.mouse.x) < 1.0 && Math.abs(this.mouse.y) < 1.0;
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
    this.renderer.setClearColor(this.clearColor);
    this.renderer.render(scene, this.camera);
  }
}
