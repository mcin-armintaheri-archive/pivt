export default {
  name: 'sidebar-widget',
  props: ['widget-controller'],
  render(createElement) {
    const props = { controller: this.widgetController };
    return createElement(this.widgetController.sidebarWidget, { props });
  },
};
