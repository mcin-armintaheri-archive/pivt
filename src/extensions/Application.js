import R from 'ramda';
import UIDUtils from './UIDUtils';

/**
 * Application is used to hold the running tools and mediators described in a JSON description.
 * It can be stopped or started and will update all of its contained tools and mediators
 * in the order they are described in an applications JSON description.
 */
export default class Application {
  constructor(name) {
    this.uid = UIDUtils.getUid();
    this.name = name;
    this.pageController = null;
    this.canvas3ds = [];
    this.tools = [];
    this.mediators = [];
    this.isRunning = false;
  }
  getUid() {
    return this.uid;
  }
  getName() {
    return this.name;
  }
  setPageController(page) {
    this.pageController = page;
  }
  getPageController() {
    return this.pageController;
  }
  addCanvas3d(canvas3d) {
    this.canvas3ds.push(canvas3d);
  }
  getCanvas3ds() {
    return this.canvas3ds;
  }
  addTool(tool) {
    this.tools.push(tool);
  }
  getTools() {
    return this.tools;
  }
  addMediator(mediator) {
    this.mediators.push(mediator);
  }
  getMediators() {
    return this.mediators;
  }
  /**
   * First update the mediators, then the tools, then the scene, then
   * user the layout to render the scene.
   */
  runApplicationLoop() {
    if (!this.isRunning) {
      return;
    }
    this.mediators.forEach((mediator) => {
      if (mediator.update) {
        mediator.update();
      }
    });
    this.tools.forEach((tool) => {
      if (tool.update) {
        tool.update();
      }
    });
    this.canvas3ds.forEach((canvas3d) => {
      const { scene, layout } = canvas3d;
      if (scene.update) {
        scene.update();
      }
      layout.render(scene.getTHREEScene());
    });
    window.requestAnimationFrame(this.runApplicationLoop.bind(this));
  }
  run() {
    this.isRunning = true;
    R.pluck('layout', this.canvas3ds).forEach((layout) => {
      layout.addLayoutListeners();
    });
    this.runApplicationLoop();
  }
  stop() {
    this.isRunning = false;
    R.pluck('layout', this.canvas3ds).forEach((layout) => {
      layout.removeLayoutListeners();
      layout.clearCanvas();
      layout.enableViewports(false);
    });
  }
  dispose() {
    this.stop();
    this.canvas3ds.forEach((canvas3d) => {
      if (canvas3d.scene.dispose) {
        canvas3d.scene.dispose();
      }
      canvas3d.layout.dispose();
    });
    this.mediators.forEach((mediator) => {
      if (mediator.dispose) {
        mediator.dispose();
      }
    });
    this.tools.forEach((tool) => {
      if (tool.dispose) {
        tool.dispose();
      }
    });
  }
}
