import R from 'ramda';
import UIDUtils from './UIDUtils';

/**
 * Application is used to hold the running tools and mediators described in a JSON description.
 * It can be stopped or started and will update all of its contained tools and mediators
 * in the order they are described in an applications JSON description.
 */
export default class Application {
  constructor(name, type) {
    this.uid = UIDUtils.getUid();
    this.name = name;
    this.type = type;
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
  setName(name) {
    this.name = name;
  }
  getType() {
    return this.type;
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
   * Serialize the state of the application into a JSON format.
   * @return {JSON}
   */
  serialize() {
    const serializeItem = (item) => {
      if (item.serialize instanceof Function) {
        return item.serialize();
      }
      return null;
    };
    const serializeTool = tool => ({
      name: tool.name,
      tool: tool.constructor.name,
      data: serializeItem(tool),
    });
    const serializeMediator = mediator => ({
      name: mediator.name,
      mediator: mediator.constructor.name,
      data: serializeItem(mediator),
    });
    const serializeCanvas3D = canvas3d => ({
      name: canvas3d.name,
      layout: {
        controller: canvas3d.layout.constructor.name,
        data: serializeItem(canvas3d.layout),
      },
      scene: {
        controller: canvas3d.scene.constructor.name,
        data: serializeItem(canvas3d.scene),
      },
    });
    return {
      type: this.getType(),
      name: this.getName(),
      page: {
        name: this.pageController.name,
        controller: this.pageController.constructor.name,
        data: serializeItem(this.pageController),
        canvas3ds: this.canvas3ds
          .map(serializeCanvas3D)
          .filter(R.compose(R.not, R.isNil, R.prop('data'))),
      },
      tools: this.tools
        .map(serializeTool)
        .filter(R.compose(R.not, R.isNil, R.prop('data'))),
      mediators: this.mediators
        .map(serializeMediator)
        .filter(R.compose(R.not, R.isNil, R.prop('data'))),
    };
  }
  /**
   * Deserialize the state of the application from a JSON format.
   * @param {JSON}
   * @return {Application}
   */
  deserialize(serialized) {
    const {
      name,
      page,
      tools,
      mediators,
    } = serialized;
    this.setName(name);
    const ps = [];
    if (page && this.pageController.deserialize instanceof Function) {
      const prom = this.pageController.deserialize(page);
      if (prom instanceof Promise) {
        ps.push(prom);
      }
    }
    const canvas3ds = page.canvas3ds;
    if (canvas3ds instanceof Array) {
      canvas3ds.forEach((c3d) => {
        this.canvas3ds.filter(c => c.name === c3d.name).forEach((c) => {
          if (c3d.data && c.deserialize instanceof Function) {
            const prom = c.deserialize(c3d.data);
            if (prom instanceof Promise) {
              ps.push(prom);
            }
          }
        });
      });
    }
    if (tools instanceof Array) {
      tools.forEach((toolJSON) => {
        this.tools.filter(t => t.name === toolJSON.name).forEach((t) => {
          if (toolJSON.data && t.deserialize instanceof Function) {
            const prom = t.deserialize(toolJSON.data);
            if (prom instanceof Promise) {
              ps.push(prom);
            }
          }
        });
      });
    }
    if (mediators instanceof Array) {
      mediators.forEach((mediatorJSON) => {
        this.mediators.filter(m => m.name === mediatorJSON.name).forEach((m) => {
          if (mediatorJSON.data && m.deserialize instanceof Function) {
            const prom = m.deserialize(mediatorJSON.data);
            if (prom instanceof Promise) {
              ps.push(prom);
            }
          }
        });
      });
    }
    return Promise.all(ps);
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
