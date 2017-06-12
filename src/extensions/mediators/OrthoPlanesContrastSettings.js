const THREE = require('three');

export default function OrthoPlaneContrastSettings(scene, layout, curvetool) {
  curvetool.onChange((csObj) => {
    const planeMaterial = scene.getPlaneMaterial();
    if (planeMaterial.uniforms && planeMaterial.uniforms.curveTexture) {
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
