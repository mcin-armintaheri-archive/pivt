
export default class ActiveViewportControlsManager {
  constructor(camControls, ...tools) {
    camControls.getViewportControls().forEach((controls) => {
      controls.withAction('mouseDownAction', () => {
        tools.forEach((tool) => {
          if (tool.switchActiveViewportControls instanceof Function) {
            tool.switchActiveViewportControls(controls);
          }
        });
      });
    });
  }
}
