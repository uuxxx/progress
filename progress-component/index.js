import EventEmitter from "./EventEmitter.js";

/**
 * @typedef State
 * @type {'normal' | 'animated' | 'hidden'}
 */

/**
 * @typedef Config
 * @type {object}
 * @property {State} state
 * @property {number} progress
 * @property {number} size
 * @property {string} stroke_width
 * @property {string} bg_color
 * @property {string} fg_color
 */

/**
 * @param {any} value
 */
function isValidProgressValue(value) {
  if (typeof value !== "number" || isNaN(value)) {
    return false;
  }

  if (!(value >= 0 && value <= 100)) {
    return false;
  }

  return true;
}

/**@param {State} state */
function isValidState(state) {
  return ["normal", "animated", "hidden"].includes(state);
}

/**@type {Config} */
const DEFAULT_CONFIG = {
  state: "normal",
  progress: 0,
  size: 250,
  stroke_width: "20px",
  bg_color: "#ddd",
  fg_color: "#5394fd",
};

export default class ProgressComponent {
  /**
   * @param {HTMLElement} $parent
   * @param {Config} config
   */
  constructor($parent, config) {
    /**
     * @private
     */
    this.eventEmitter = new EventEmitter();

    /**
     * @type {HTMLElement}
     * @private
     */
    this.$parent = $parent;

    /**
     * @type {Config}
     * @private
     */
    this.config = Object.assign({}, DEFAULT_CONFIG, config);

    /**
     * @type {HTMLElement}
     * @private
     */
    this.$root;

    /**
     * @type {HTMLElement}
     * @private
     */
    this.$fg;

    /**
     * @type {boolean}
     * @private
     */
    this.destroyed = false;

    this.#render();

    this.setState = this.setState.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.changeProgressValue = this.changeProgressValue.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /**
   * @param {HTMLElement} $el
   * @param {Config} config
   */
  #defineCssVars($el, config) {
    for (let key in config) {
      let value = config[key];
      if (key === "size") {
        value += "px";
      }

      key = key.replace(/_/g, "-");

      $el.style.setProperty(`--${key}`, value);
    }
  }

  #render() {
    const { size, state } = this.config;
    this.config.state = null;

    const div = document.createElement("div");
    this.#defineCssVars(div, this.config);

    div.attachShadow({ mode: "open" }).innerHTML = ` 
      <link rel="stylesheet"  href="progress-component/styles.css" />
      <svg
        width="${size}"
        height="${size}"
        viewBox="0 0 ${size} ${size}"
        class="circular-progress"
      >
        <circle id="circle-bg" class="bg"></circle>
        <circle id="circle-fg" class="fg"></circle>
      </svg>`;

    this.$fg = div.shadowRoot.querySelector("#circle-fg");
    this.$root = div;

    setTimeout(() => {
      Object.keys(this.config).forEach((property) => {
        if (property !== state) {
          this.eventEmitter.emit(property, [null, this.config[property]]);
        }
      });
      this.setState(state);
    }, 0);
    this.$parent.appendChild(div);
  }

  #offAnimation() {
    this.$fg.style.animation = "none";
  }

  #onAnimation() {
    this.$fg.style.animation = "rotation 3s linear infinite";
  }

  #show() {
    this.$root.style.visibility = "visible";
  }

  #hide() {
    this.$root.style.visibility = "hidden";
  }

  /**@param {State} state */
  setState(state) {
    if (this.destroyed) return;
    if (!isValidState(state)) return;
    if (state === this.config.state) return;

    switch (state) {
      case "normal":
        this.#offAnimation();
        this.#show();
        break;
      case "animated":
        this.#show();
        this.#onAnimation();
        break;
      case "hidden":
        this.#hide();
        this.#offAnimation();
        break;
      default:
        break;
    }

    this.eventEmitter.emit("state", [this.config.state, state]);
    this.config.state = state;
  }

  getConfig() {
    return Object.freeze({ ...this.config });
  }

  get subscribeOnConfigChange() {
    return this.eventEmitter.on;
  }

  /**@param {number} value */
  changeProgressValue(value) {
    if (this.config.state !== "normal") return;
    if (this.destroyed) return;
    if (!isValidProgressValue(value)) {
      return;
    }

    this.eventEmitter.emit("progress", [this.config.progress, value]);
    this.config.progress = value;
    this.#defineCssVars(this.$root, { progress: value });
  }

  destroy() {
    if (!this.destroyed) {
      this.$parent.removeChild(this.$root);
      this.eventEmitter.clear();
      this.destroyed = true;
    }
  }
}
