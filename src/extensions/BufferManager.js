import {
  FileToArrayBufferReader,
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
  addBuffer(buffer) {
    this.buffers[buffer.uid] = buffer;
    this.bufferLoadCallbacks.forEach((f) => {
      f(buffer);
    });
  }
  loadBrainVolume(file, callback) {
    const file2Buff = new FileToArrayBufferReader();
    file2Buff.addInput(file);
    file2Buff.update();
    const loader = this;
    file2Buff.on('ready', function fileBufferIsReady() {
      const buffer = this.getOutput();
      loader.addBuffer({
        uid: UIDUtils.getUid(),
        name: file.name,
        size: file.size,
        buffer,
      });
      callback(buffer);
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
}

let instance = null;

export default {
  getInstance() {
    return instance || (instance = new BufferManager());
  },
};
