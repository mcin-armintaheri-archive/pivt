export default class SliceTraversal {
  constructor() {
    this.activeControls = null;
  }
  switchActiveViewportControls(controls) {
    this.activeControls = controls;
  }
}
