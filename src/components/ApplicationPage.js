/**
 * A low-level vuejs component purely to use the createElement callback
 * passed by the vuejs rendering lifecycle to render an arbitrary vuejs
 * component given its constructor.
 */
export default {
  name: 'application-page',
  props: ['application'],
  render(createElement) {
    const controller = this.application.pageController;
    if (!controller.pageConfig) {
      return null;
    }
    return createElement(controller.pageConfig.page, { props: { controller } });
  }
};
