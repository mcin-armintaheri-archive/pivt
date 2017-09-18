function S4() {
  /* eslint-disable no-bitwise */
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export default {
  /**
   * Generate a UUID
   * @return {String} UUID
   */
  getUid() {
    return (
      `${S4()}${S4()}-${S4()}-4${S4().substr(0, 3)}-${S4()}-${S4()}${S4()}${S4()}`
    ).toLowerCase();
  }
};
