export default class PlanesShaderTransmitter {
  constructor(materialManager, ...observers) {
    materialManager.onMaterialChange((shaderManager) => {
      observers.forEach((o) => { o.setShaderManager(shaderManager); });
    });
  }
}
