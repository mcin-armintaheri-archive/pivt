import {
  FileToArrayBufferReader,
  Image3DGenericDecoder,
} from 'pixpipejs';

import UIDUtils from './UIDUtils';

/* eslint-disable no-alert */
class BufferManager {
  constructor() {
    this.buffers = {};
    this.bufferLoadCallbacks = [];
  }
  getBufferList() {
    return Object.values(this.buffers);
  }
  getBuffer(uid) {
    return this.buffers[uid];
  }
  addBuffer(uid, buffer) {
    this.buffer[uid] = buffer;
  }
  loadBrainVolume(file) {
    const file2Buff = new FileToArrayBufferReader();
    file2Buff.addInput(file);
    file2Buff.update();
    const loader = this;
    file2Buff.on('ready', function fileBufferIsReady() {
      const buff = this.getOutput();
      const decoder = new Image3DGenericDecoder();
      decoder.addInput(buff);
      decoder.update();
      if (!decoder.getNumberOfOutputs()) {
        alert('Cannot open the uploaded file.');
        return;
      }
      const mniVol = decoder.getOutput();
      if (!mniVol) {
        alert('Cannot decode uploaded file.');
        return;
      }
      loader.addBuffer({
        uid: UIDUtils.getUid(),
        buffer: mniVol,
      });
    });
  }
  onBufferLoad(callback) {
    if (callback instanceof Function) {
      this.bufferLoadCallbacks.push(callback);
    }
  }
  removeHandler(callback) {
    this.bufferLoadCallbacks = this.bufferLoadCallbacks.filter(f => f !== callback);
  }
  loadBuffer
}

let instance = null;

module.exports = function getBufferManager() {
  return instance || (instance = new BufferManager());
};
