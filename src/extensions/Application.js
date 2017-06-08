
export default class Application {
  constructor(name) {
    this.name = name;
  }
  setScene(scene) {
    this.scene = scene;
  }
  setLayout(layout) {
    this.layout = layout;
  }
  run() {
    this.layout.render(this.scene.getTHREEScene());
    window.requestAnimationFrame(this.run.bind(this));
  }
}
