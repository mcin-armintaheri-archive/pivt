// import * as THREE from 'three';

/**
 * LineSegmentTransmitter is a mediator that takes the begin and end
 * position of a line segment drawn by LineSegmentTool to sample the MNI volume
 * loaded by PlanesMaterialManager and broadcast the line endpoints along with the
 * sampled values along the line.
 *
 * @param  {OrthoPlanes} scene
 * @param  {XYZPerspectiveQuadView} layout
 * @param  {PlanesMaterialManager} materialManager
 * @param  {LineSegmentTool} lineSegmentTool
 * @param  {SpectrumPlot} spectrumPlot
 */
export default class LineSegmentTransmitter {
  constructor(view, camControls, materialManager, lineSegmentTool, ...observers) {
    this.observers = observers;
    this.shaderManager = null;
    lineSegmentTool.onSegmentChange((begin, end) => {
      if (!this.shaderManager) {
        return;
      }
      const overlaySegments = this.shaderManager.getMRIs().map((overlay) => {
        const sample = overlay.getImage3D().getSegmentSampleTransfoSpace(
          'w2v',
          'v2w',
          begin,
          end
        );
        return {
          name: overlay.name,
          values: sample.colors,
          labels: sample.labels
        };
      });
      observers.forEach((o) => {
        if (o.setLineSegment instanceof Function) {
          o.setLineSegment(begin, end, overlaySegments);
        }
      });
    });
    materialManager.onMaterialChange((shaderManager) => {
      this.shaderManager = shaderManager;
      lineSegmentTool.initialize(view.layout.getBottomRight(), camControls);
    });
  }
}
