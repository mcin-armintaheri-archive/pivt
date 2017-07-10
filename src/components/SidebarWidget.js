/**
 * A low-level vuejs component purely to use the createElement callback
 * passed by the vuejs rendering lifecycle to render an arbitrary vuejs
 * component given its constructor.
 */
export default {
  name: 'sidebar-widget',
  props: ['widget-controller'],
  render(createElement) {
    const props = { controller: this.widgetController };
    const sidebarEl = this.widgetController.sidebarWidget;
    return sidebarEl ? createElement(sidebarEl, { props }) : null;
  },
};
