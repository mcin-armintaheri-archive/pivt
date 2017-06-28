const THREE = require('three');

export default function OrthoPlaneContrastSettings(curvetool, materialManager) {
  curvetool.setTitle('Contrast');
  curvetool.onChange((csObj) => {
    const planeMaterial = materialManager.getPlaneMaterial();
    if (planeMaterial && planeMaterial.uniforms && planeMaterial.uniforms.curveTexture) {
      const ys = csObj.getYSeriesInterpolated();
      const texture = new THREE.DataTexture(
        ys,
        ys.length,
        1,
        THREE.LuminanceFormat,
        THREE.FloatType,
      );
      texture.needsUpdate = true;
      planeMaterial.uniforms.curveTexture.value = texture;
      planeMaterial.uniforms.enableCurve.value = true;
    }
  });
}
