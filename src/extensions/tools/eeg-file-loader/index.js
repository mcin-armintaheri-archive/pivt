import EEGFileLoaderWidget from './EEGFileLoaderWidget';

export default class EEGFileLoader {
  constructor() {
    this.sidebarWidget = EEGFileLoaderWidget;
  }
  loadEEGBuffer(buffer) {
    this.buffer = buffer;
    console.log(buffer);
  }
}
