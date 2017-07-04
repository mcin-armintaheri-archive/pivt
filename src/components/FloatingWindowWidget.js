export default {
  name: 'floating-window-widget',
  props: ['window-controller'],
  render(createElement) {
    const props = { controller: this.windowController };
    const config = this.windowController.windowConfig || {};
    return config.widget ? createElement(config.widget, { props }) : null;
  },
};
