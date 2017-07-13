export default {
  name: 'tool-component',
  props: ['controller'],
  render(createElement) {
    const el = this.controller.toolComponent;
    const props = { controller: this.controller };
    return el ? createElement(el, { props }) : null;
  },
};
