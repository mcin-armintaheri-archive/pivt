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
    const ys = csObj.getYSeriesInterpolated();
    const texture = new THREE.DataTexture(
      ys,
      ys.length,
      1,
      THREE.LuminanceFormat,
      THREE.FloatType
    );
    texture.needsUpdate = true;
    const shaderManager = materialManager.getShaderManager();
    shaderManager.setUniform('contrastTexture', texture);
    savedUniforms.contrastTexture = texture;
    shaderManager.setUniform('enableConstrast', true);
  });
  curvetool.onBrightnessChange((brightness) => {
    if (!savedUniforms) {
      savedUniforms = {};
    }
    const shaderManager = materialManager.getShaderManager();
    const computedBrightness = 1 + (brightness * BRIGHTNESS_FACTOR);
    shaderManager.setUniform('brightness', computedBrightness);
    savedUniforms.brightness = computedBrightness;
  });
  materialManager.onMaterialChange(() => {
    if (savedUniforms) {
      const shaderManager = materialManager.getShaderManager();
      savedUniforms.contrastTexture.needsUpdate = true;
      shaderManager.setUniform('contrastTexture', savedUniforms.contrastTexture);
      shaderManager.setUniform('enableConstrast', true);
      shaderManager.setUniform('brightness', savedUniforms.brightness);
    }
  });
}
