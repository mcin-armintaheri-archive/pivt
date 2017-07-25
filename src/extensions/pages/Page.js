/**
 * Base class for all application page controllers.
 * This class handles communicating the mounting of the canvas layouts
 * thoughout the application.
 */
export default class Page {
  constructor() {
    this.canvas3dPromises = {};
    this.canvas3dCallbacks = {};
    this.resolved = {};
  }
  /**
   * Get a promise which resolves when the mount point for a canvaslayout has mounted
   * into the UI.
   * @param  {String} name Name of the layout as per JSON description of application.
   * @return {Promise} Promise which gives the canvas and renderer to load into a canvas layout.
   */
  waitForCanvas3d(name) {
    /* If the canvas hasen't mounted, return a promise which will resolve when the
     * canvas mounts. Otherwise return a promise with the resolved canvas and renderer.
     */
    if (!this.canvas3dPromises[name]) {
      this.canvas3dPromises[name] = new Promise((resolve) => {
        this.canvas3dCallbacks[name] = resolve;
      });
    } else {
      this.canvas3dPromises = Promise.resolve(this.resolved[name]);
    }
    return this.canvas3dPromises[name];
  }
  /**
   * Used by three-view to resolve a canvas and renderer for a given layout.
   * @param  {String} name
   * @param  {WebGLRenderer} renderer
   * @param  {HTMLElement} canvas
   */
  resolveCanvas3d(name, renderer, canvas) {
    if (this.canvas3dCallbacks[name]) {
      this.resolved[name] = { name, renderer, canvas };
      this.canvas3dCallbacks[name](this.resolved[name]);
      delete this.canvas3dCallbacks[name];
    }
  }
}
