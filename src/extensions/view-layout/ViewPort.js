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
    far = 1000,
  ) {
    const rectangle = canvas.getBoundingClientRect();
    this.enabled = false;
    this.canvas = canvas;
    this.renderer = renderer;
    this.canvasRectangle = rectangle;
    this.frustrumSize = height * rectangle.height;
    this.viewport = { bottom, left, width, height, near, far };
    this.raycaster = new THREE.Raycaster();
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
        /* eslint-disable quotes */
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
  }
  setNear(near) {
    this.camera.near = near;
  }
  setFar(far) {
    this.camera.near = far;
  }
  enableControls(boolean) {
    this.enabled = boolean;
  }
  setClearColor(color) {
    this.clearColor = color;
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
    this.updateControls();
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
  updateControls() {
    if (this.controls) {
      this.controls.enabled = this.enabled && this.mouseIntersects();
    }
  }
  updateMousePosition(x, y, width, height) {
    const viewportWidthPX = width * this.viewport.width;
    const viewportHeightPX = height * this.viewport.height;
    this.mouse.set(
       ((2 * (((x - (width * this.viewport.left))) / viewportWidthPX)) - 1),
      -((2 * (((y - (height * this.viewport.bottom))) / viewportHeightPX)) - 1),
    );
  }
  mousePickScene(sceneObjects) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(sceneObjects);
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
