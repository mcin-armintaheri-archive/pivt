import R from 'ramda';
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
    window.bm = this;
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
    const uid = UIDUtils.getUid();
    this.buffers[uid] = R.assoc('uid', uid, bufferMeta);
    this.bufferLoadCallbacks.forEach((f) => {
      f(bufferMeta);
    });
    return uid;
  }
  /**
   * Use pixpipejs FileToArrayBufferReader to load a file on the filesystem
   * as a pixpipe buffer. This buffer can be decoded by various tools
   * running in some application.
   * @param  {FILE} file BLOB containing buffer data.
   * @param  {Function} callback function called with buffer when loading is complete.
   * @return {Promise} promise that resolves when the buffer loads.
   */
  loadBuffer(file) {
    const file2Buff = new FileToArrayBufferReader();
    file2Buff.addInput(file);
    file2Buff.update();
    const loader = this;
    return new Promise((resolve) => {
      file2Buff.on('ready', function fileBufferIsReady() {
        const buffer = this.getOutput();
        const uid = loader.addBuffer({
          name: file.name,
          size: file.size,
          buffer,
          checksum: this.getMetadata('checksums')[0],
        });
        resolve(uid);
      });
    });
  }
  /**
   * Produce a serializable JSON of the currently loaded buffers.
   * @param {Array<ArrayBuffer>} buffers list of buffers to serialize
   * @return {JSON}
   */
  serialize(buffers) { // eslint-disable-line class-methods-use-this
    const bufferMetas = R.project(['name', 'checksum'], buffers);
    const data = R.pluck('buffer', buffers);
    return { _metadata: bufferMetas, _data: data };
  }
  /**
   * Add the buffers serialized inside a JSON value returned from serialize(buffers).
   * @param {JSON} buffersJSON JSON value return from serialize(buffers)
   */
  unserialize(buffersJSON) {
    const { _metadata, _data } = buffersJSON;
    const buffers = R.zipWith(R.assoc('buffer'), _data, _metadata);
    buffers
      .map(b => R.assoc('size', b.buffer.byteLength, b))
      .forEach(this.addBuffer.bind(this));
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
