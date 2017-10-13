
/**
 * ActiveViewportControlsManager notifies all tools of the last viewport that
 * was clicked with an instance of the camera controls of that viewport.
 */
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
