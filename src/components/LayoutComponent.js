
/**
 * A low-level vuejs component purely to use the createElement callback
 * passed by the vuejs rendering lifecycle to render an arbitrary vuejs
 * component given its constructor.
 */
export default {
  name: 'layout-component',
  props: ['layout-controller'],
  render(createElement) {
    const props = { controller: this.layoutController };
    const layoutEl = this.layoutController.layoutComponent;
    return layoutEl ? createElement(layoutEl, { props }) : null;
  },
};
