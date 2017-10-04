import HelpSidebarWidget from './HelpSidebarWidget';

export default class AppHelp {
  constructor() {
    this.windowConfig = {
      widget: null,
      title: 'Camera Parameters',
      openPosition: { x: 0.4, y: 0.02, viewportCoords: true },
      open: false
    };
    this.sidebarWidget = HelpSidebarWidget;
  }
  setHelpMessageComponent(component) {
    this.windowConfig.widget = component;
  }
  toggleHelp() {
    this.windowConfig.open = !this.windowConfig.open;
  }
}
