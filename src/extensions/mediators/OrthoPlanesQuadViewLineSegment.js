const THREE = require('three');

export default class OrthoPlanesLineSegmentTool {
  constructor(scene, layout, materialManager, lineSegmentTool, spectrumPlot) {
    spectrumPlot.setWindowTitle('Segment Intensity Plot');
    materialManager.onMaterialChange((_1, dimensions, mniVolume) => {
      lineSegmentTool.initialize(scene, layout.getBottomRight());
      const { x, y, z } = dimensions;
      const offset = new THREE.Vector3(x / 2, y / 2, z / 2);
      lineSegmentTool.onSegmentChange((begin, end) => {
        const fromPos = begin.clone();
        fromPos.y *= -1;
        const toPos = end.clone();
        toPos.y *= -1;
        fromPos.add(offset);
        toPos.add(offset);
        const intensities = mniVolume.getSegmentSample(fromPos, toPos, 0);
        spectrumPlot.updateSeries(intensities.colors[0], intensities.labels);
      });
    });
  }
}
