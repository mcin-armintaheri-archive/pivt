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
    const page = controller.page;
    return page ? createElement(page, { props: { controller } }) : null;
  },
};
