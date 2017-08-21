import * as THREE from 'three';

/**
 * OrthoPlanesLineSegmentTool is a mediator that takes the begin and end
 * position of a line segment drawn by LineSegmentTool to sample the MNI volume
 * loaded by PlanesMaterialManager and plot those intensities into SpectrumPlot.
 * @param  {OrthoPlanes} scene
 * @param  {XYZPerspectiveQuadView} layout
 * @param  {PlanesMaterialManager} materialManager
 * @param  {LineSegmentTool} lineSegmentTool
 * @param  {SpectrumPlot} spectrumPlot
 */
export default class OrthoPlanesQuadViewLineSegment {
  constructor(view, camControls, materialManager, lineSegmentTool, intensityPlot) {
    intensityPlot.setWindowTitle('Segment Intensity Plot');
    materialManager.onMaterialChange((_1, dimensions, mniVolume) => {
      lineSegmentTool.initialize(view.layout.getBottomRight(), camControls);
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
        intensityPlot.updateSeries(intensities.colors[0], intensities.labels);
      });
    });
  }
}
