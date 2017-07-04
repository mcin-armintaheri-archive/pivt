export default class OrthoPlanesLineSegmentTool {
  constructor(scene, layout, materialManager, lineSegmentTool) {
    materialManager.onMaterialChange(() => {
      lineSegmentTool.initialize(scene, layout.getBottomRight());
    });
  }
}
