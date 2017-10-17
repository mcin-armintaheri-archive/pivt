import * as THREE from 'three';

const BRIGHTNESS_FACTOR = 3;

/**
 * Using the interpolated values of the CurveTool, update the material
 * of the OrthoPlanes scene with the new contrast mapping.
 * @param       {CurveTool} curvetool
 * @param       {PlanesMaterialManager} materialManager
 * @constructor
 */
export default function OrthoPlanesContrastSettings(curvetool, materialManager) {
  curvetool.setTitle('Contrast and Brightness');
  let savedUniforms = null;
  curvetool.onContrastChange((csObj) => {
    if (!savedUniforms) {
      savedUniforms = {};
    }
    const planeMaterial = materialManager.getPlaneMaterial();
    if (planeMaterial && planeMaterial.uniforms && planeMaterial.uniforms.curveTexture) {
      const ys = csObj.getYSeriesInterpolated();
      const texture = new THREE.DataTexture(
        ys,
        ys.length,
        1,
        THREE.LuminanceFormat,
        THREE.FloatType
      );
      texture.needsUpdate = true;
      planeMaterial.uniforms.curveTexture.value = texture;
      savedUniforms.curveTexture = planeMaterial.uniforms.curveTexture.value;
      planeMaterial.uniforms.enableCurve.value = true;
    }
  });
  curvetool.onBrightnessChange((brightness) => {
    if (!savedUniforms) {
      savedUniforms = {};
    }
    const planeMaterial = materialManager.getPlaneMaterial();
    if (planeMaterial && planeMaterial.uniforms && planeMaterial.uniforms.brightness) {
      planeMaterial.uniforms.brightness.value = 1 + (brightness * BRIGHTNESS_FACTOR);
      savedUniforms.brightness = planeMaterial.uniforms.brightness.value;
    }
  });
  materialManager.onMaterialChange(() => {
    const planeMaterial = materialManager.getPlaneMaterial();
    if (savedUniforms) {
      savedUniforms.curveTexture.needsUpdate = true;
      planeMaterial.uniforms.curveTexture.value = savedUniforms.curveTexture;
      planeMaterial.uniforms.enableCurve.value = true;
      planeMaterial.uniforms.brightness.value = savedUniforms.brightness;
    }
  });
}
