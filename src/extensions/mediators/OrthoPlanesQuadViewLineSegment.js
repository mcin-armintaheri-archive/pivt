export default class OrthoPlanesLineSegmentTool {
  constructor(scene, layout, materialManager, lineSegmentTool, spectrumPlot) {
    spectrumPlot.setWindowTitle('Segment Intensity Plot');
    materialManager.onMaterialChange(() => {
      lineSegmentTool.initialize(scene, layout.getBottomRight());
    });
  }
}
