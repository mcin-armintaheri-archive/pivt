export default {
  name: 'sidebar-widget',
  props: ['widget-component', 'widget-component-props'],
  render(createElement) {
    const props = this.widgetComponentProps || {};
    return createElement(this.widgetComponentProps, { props });
  },
};
