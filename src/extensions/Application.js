import UIDUtils from './UIDUtils';
import CanvasLayout from './view-layout/canvas/CanvasLayout';

/**
 * Application is used to hold the running tools and mediators described in a JSON description.
 * It can be stopped or started and will update all of its contained tools and mediators
 * in the order they are described in an applications JSON description.
 */
export default class Application {
  constructor(name) {
    this.uid = UIDUtils.getUid();
    this.name = name;
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
  setScene(scene) {
    this.scene = scene;
  }
  setLayout(layout) {
    this.layout = layout;
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
    if (this.scene && this.scene.update) {
      this.scene.update();
    }
    if (this.layout.render) {
      if (this.scene && this.scene.getTHREEScene) {
        this.layout.render(this.scene.getTHREEScene());
      } else {
        this.layout.render();
      }
    }
    window.requestAnimationFrame(this.runApplicationLoop.bind(this));
  }
  run() {
    this.isRunning = true;
    if (this.layout instanceof CanvasLayout) {
      this.layout.addLayoutListeners();
      this.layout.enableViewports(true);
    }
    this.runApplicationLoop();
  }
  stop() {
    this.isRunning = false;
    if (this.layout instanceof CanvasLayout) {
      this.layout.removeLayoutListeners();
      this.layout.clearCanvas();
      this.layout.enableViewports(false);
    }
  }
  dispose() {
    this.stop();
    if (this.layout.dispose) {
      this.layout.dispose();
    }
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
    if (this.scene && this.scene.dispose) {
      this.scene.dispose();
    }
  }
}
