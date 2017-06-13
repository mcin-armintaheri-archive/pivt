export default {
  name: 'sidebar-widget',
  props: ['widget-controller'],
  render(createElement) {
    const props = { controller: this.widgetController };
    const sidebarEl = this.widgetController.sidebarWidget;
    return sidebarEl ? createElement(sidebarEl, { props }) : null;
  },
};
