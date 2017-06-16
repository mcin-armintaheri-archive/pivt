import {
  FileToArrayBufferReader,
  Image3DGenericDecoder,
} from 'pixpipejs';
import { MessageBox } from 'element-ui';

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
      const buff = this.getOutput();
      const decoder = new Image3DGenericDecoder();
      decoder.addInput(buff);
      decoder.update();
      if (!decoder.getNumberOfOutputs()) {
        MessageBox.alert(`Cannot decode ${file.name} into a buffer.`, 'Decoding Error', {
          confirmButtonText: 'OK',
        });
        callback();
        return;
      }
      const mniVol = decoder.getOutput();
      if (!mniVol) {
        MessageBox.alert(`Cannot decode ${file.name} into a buffer.`, 'Decoding Error', {
          confirmButtonText: 'OK',
        });
        callback();
        return;
      }
      loader.addBuffer({
        uid: UIDUtils.getUid(),
        name: file.name,
        size: file.size,
        buffer: mniVol,
      });
      callback(mniVol);
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
