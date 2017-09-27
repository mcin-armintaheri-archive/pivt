import * as THREE from 'three';

const ZERO = new THREE.Vector3(0, 0, 0);

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
   * @param {[String]} control [what type of control the camera should use.]
   * @param {[number]} near [near plane of camera]
   * @param {[number]} far [far plane of camera]
   */
  constructor(
    canvas,
    renderer,
    left,
    bottom,
    width,
    height,
    type,
    near = 0.1,
    far = 6000
  ) {
    const rectangle = canvas.getBoundingClientRect();
    this.enabled = false;
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
    this.type = type;
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
        throw new Error(`Camera type must be either ${ORTHOGRAPHIC} or ${PERSPECTIVE}, not "${type}"`);
      }
    }
    this.setNear(near);
    this.setFar(far);
    this.camera.position.z = 5.0;
  }
  getType() {
    return this.type;
  }
  /**
   * Get the Orthographic viewport dimensions
   * @type {[type]}
   */
  getOrthographicDimensions() {
    const { left, right, top, bottom } = this.camera;
    return { left, right, top, bottom };
  }
  getScreenPosition() {
    const { left, bottom } = this.viewport;
    return { left, bottom };
  }
  setScreenPosition(left, bottom) {
    this.viewport.left = left;
    this.viewport.bottom = bottom;
  }
  /**
   * Get the reference to the THREE.Camera used by this viewport.
   */
  getTHREECamera() {
    return this.camera;
  }
  /**
   * Get a reference to the mouse position local to the current viewport's center.
   * The position's components are normalized between -1 and 1.
   * @return {Object} mouse reference
   */
  getMousePosReference() {
    return this.mouse;
  }
  /**
   * Get the X, Y, Z unit axes of a camera in world coordinates.
   * @return {Object} unit axes.
   */
  getCameraAxes() {
    const camera = this.getTHREECamera();
    const zDir = camera.getWorldDirection().multiplyScalar(-1).normalize();
    const yDir = camera.up.clone().normalize();
    const xDir = new THREE.Vector3().crossVectors(yDir, zDir).normalize();
    return { xDir, yDir, zDir };
  }
  /**
   * Unapply the current pan offset of the camera. Useful when transforming
   * the camera's position and orientation without needing to worry about
   * arbitrary panning.
   */
  inversePan(axes) {
    const camera = this.getTHREECamera();
    const { x, y } = this.getPan();
    const { xDir, yDir } = axes || this.getCameraAxes();
    camera.position.sub(xDir.multiplyScalar(x)).sub(yDir.multiplyScalar(y));
  }
  /**
   * Apply the current pan offset of the camera. Useful after transforming
   * the camera's position and orientation
   */
  applyPan(axes) {
    const camera = this.getTHREECamera();
    const { x, y } = this.getPan();
    const { xDir, yDir } = axes || this.getCameraAxes();
    const posOffset = new THREE.Vector3().addVectors(
      xDir.multiplyScalar(x),
      yDir.multiplyScalar(y)
    );
    camera.position.add(posOffset);
  }
  getPan() {
    const { x, y } = this.pan;
    return { x, y };
  }
  setPan(pan) {
    this.inversePan();
    this.pan.x = pan.x !== undefined ? pan.x : this.pan.x;
    this.pan.y = pan.y !== undefined ? pan.y : this.pan.y;
    this.applyPan();
  }
  /**
   * Roll the camera by an angle from it's current orientation.
   * @param  {[type]} angle increment of roll angle
   */
  rollBy(angle) {
    this.inversePan();
    const axis = this.camera.getWorldDirection().normalize().multiplyScalar(-1.0);
    this.camera.up.applyAxisAngle(axis, angle);
    this.camera.lookAt(ZERO);
    this.applyPan();
  }
  setNear(near) {
    this.camera.near = near;
  }
  setFar(far) {
    this.camera.far = far;
  }
  setClearColor(color) {
    this.clearColor = color;
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
  /**
   * Get normalized viewport position of the mouse local to viewport's center.
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} width   width of canvas
   * @param  {Number} height  height of canvas
   * @param  {THREE.Vector2} target Vector2 to hold new mouse coordinates
   */
  getViewportMousePosition(x, y, width, height, target) {
    const viewportWidthPX = width * this.viewport.width;
    const viewportHeightPX = height * this.viewport.height;
    const yOffset = this.viewport.height - this.viewport.bottom;
    target.set(
      ((2 * (((x - (width * this.viewport.left))) / viewportWidthPX)) - 1),
      -((2 * (((y - (height * yOffset))) / viewportHeightPX)) - 1)
    );
  }
  /**
   * true if the mouse intersects this viewport.
   * @return {boolean}
   */
  mouseIntersects() {
    return mouseIntersectsViewport(this.mouse);
  }
  /**
   * true if the last mouse down position intersects this viewport.
   */
  lastMouseDownIntersects() {
    return mouseIntersectsViewport(this.lastMouseDown);
  }
  /**
   * Update the mouse position reference with the current local viewport position
   * of the mouse with coordinates mapped to -1, 1.
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} width   width of canvas
   * @param  {Number} height  height of canvas
   */
  updateMousePosition(x, y, width, height) {
    this.getViewportMousePosition(x, y, width, height, this.mouse);
  }
  /**
   * Update the lastMouseDown position reference with the current local viewport position
   * of the mouse with coordinates mapped to -1, 1. Used when mouse is clicked in the viewport.
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} width   width of canvas
   * @param  {Number} height  height of canvas
   */
  updateLastMouseDownPosition(x, y, width, height) {
    this.getViewportMousePosition(x, y, width, height, this.lastMouseDown);
  }
  /**
   * Update the lastMouseUp position reference with the current local viewport position
   * of the mouse with coordinates mapped to -1, 1. Used when mouse is released in the viewport.
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} width   width of canvas
   * @param  {Number} height  height of canvas
   */
  updateLastMouseUpPosition(x, y, width, height) {
    this.getViewportMousePosition(x, y, width, height, this.lastMouseUp);
  }
  /**
   * Render the scene to the viewport using the camera associated with this viewport.
   * @param  {THREE.Scene} scene
   */
  renderWith(scene) {
    const { width, height } = this.canvasRectangle;
    this.renderer.setViewport(
      width * this.viewport.left,
      height * this.viewport.bottom,
      width * this.viewport.width,
      height * this.viewport.height
    );
    this.renderer.setScissor(
      width * this.viewport.left,
      height * this.viewport.bottom,
      width * this.viewport.width,
      height * this.viewport.height
    );
    this.renderer.setScissorTest(true);
    this.renderer.setClearColor(this.clearColor, 1);
    this.renderer.render(scene, this.camera);
  }
}
