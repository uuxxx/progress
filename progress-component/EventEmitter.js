/**
 * @callback On
 * @param {any} prevState
 * @param {any} curState
 * @return {void}
 */

/**
 * @typedef {{[event: string]: On[]}} EventMap
 */

export default class EventEmitter {
  constructor() {
    /**
     * @type {EventMap}
     * @private
     */
    this.eventMap = {};

    this.on = this.on.bind(this);
    this.emit = this.emit.bind(this);
    this.clear = this.clear.bind(this);
  }
  /**
   *
   * @param {string} event
   * @param {On} fn
   */
  on(event, fn) {
    if (!(event in this.eventMap)) {
      this.eventMap[event] = [];
    }
    this.eventMap[event].push(fn);

    return {
      unsubscribe: () => {
        this.eventMap[event] = this.eventMap[event].filter((cb) => cb !== fn);

        if (!this.eventMap[event].length) {
          delete this.eventMap[event];
        }
      },
    };
  }

  /**
   *
   * @param {string} event
   * @param {any[]} args
   */
  emit(event, args) {
    if (event in this.eventMap) {
      this.eventMap[event].forEach((cb) => cb(...args));
    }
  }

  clear() {
    this.eventMap = {};
  }
}
