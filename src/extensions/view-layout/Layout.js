export default class Layout {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
  }
  mousePosition(event) {
    const { top, left, width, height } = this.canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    if (!this.updateMouse) {
      const err = 'Layout should implement the method "updateMouse"';
      throw err;
    }
    return { x, y, width, height };
  }
  mouseMove(event) {
    const { x, y, width, height } = this.mousePosition(event);
    this.updateMouse(x, y, width, height);
  }
  removeLayoutListeners() {
    this.canvas.removeEventListener('mousemove', this.mouseMove.bind(this));
  }
}
