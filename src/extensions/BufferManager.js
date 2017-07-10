import {
  FileToArrayBufferReader,
} from 'pixpipejs';

import UIDUtils from './UIDUtils';

/**
 * Using pixpipejs, the buffer manager is a singleton which offers
 * the application a central store to add and retrieve pixpipe buffers.
 */
class BufferManager {
  constructor() {
    this.buffers = {};
    this.bufferLoadCallbacks = [];
  }
  /**
   * Get the list of currently loaded buffers.
   * @return {Array} buffers.
   */
  getBufferList() {
    return Object.values(this.buffers);
  }
  /**
   * Get a buffer by uid
   * @param  {String} uid
   * @return {Object} buffer
   */
  getBuffer(uid) {
    return this.buffers[uid];
  }
  /**
   * Given an object with the metadata of a buffer, add it to the
   * set of currently loaded buffers.
   * @param {Object} bufferMeta object holding the metadata and data of the buffer.
   */
  addBuffer(bufferMeta) {
    this.buffers[bufferMeta.uid] = bufferMeta;
    this.bufferLoadCallbacks.forEach((f) => {
      f(bufferMeta);
    });
  }
  /**
   * Use pixpipejs FileToArrayBufferReader to load a file on the filesystem
   * as a pixpipe buffer. This buffer can be decoded by various tools
   * running in some application.
   * @param  {FILE} file BLOB containing buffer data.
   * @param  {Function} callback function called with buffer when loading is complete.
   */
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
  /**
   * Register an event handler when a buffer is loaded.
   * @param  {Function} callback buffer loaded handler
   */
  onBufferLoad(callback) {
    if (callback instanceof Function) {
      this.bufferLoadCallbacks.push(callback);
    }
  }
  /**
   * Unregister a buffer loaded callback
   * @param  {Function} callback buffer loaded handler
   */
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
