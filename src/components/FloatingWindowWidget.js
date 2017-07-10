/**
 * A low-level vuejs component purely to use the createElement callback
 * passed by the vuejs rendering lifecycle to render an arbitrary vuejs
 * component given its constructor.
 */
export default {
  name: 'floating-window-widget',
  props: ['window-controller'],
  render(createElement) {
    const props = { controller: this.windowController };
    const config = this.windowController.windowConfig || {};
    return config.widget ? createElement(config.widget, { props }) : null;
  },
};
