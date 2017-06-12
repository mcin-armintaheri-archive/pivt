
function S4() {
  /* eslint-disable no-bitwise */
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}


export default class Application {
  constructor(name) {
    const guid = (
      `${S4()}${S4()}-${S4()}-4${S4().substr(0, 3)}-${S4()}-${S4()}${S4()}${S4()}`
    ).toLowerCase();
    this.uid = guid;
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
  runApplicationLoop() {
    if (!this.isRunning) {
      return;
    }
    this.layout.render(this.scene.getTHREEScene());
    window.requestAnimationFrame(this.run.bind(this));
  }
  run() {
    this.isRunning = true;
    this.runApplicationLoop();
  }
  stop() {
    this.isRunning = false;
  }
}
