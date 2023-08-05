import { api, LightningElement } from "lwc";

const COLOR_NO = "tilewall-day tilewall-day_count-default";
const COLOR_WEAK = "tilewall-day tilewall-day_count-low";
const COLOR_NORMAL = "tilewall-day tilewall-day_count-medium";
const COLOR_STRONG = "tilewall-day tilewall-day_count-high";

export default class TilewallDay extends LightningElement {
  /** @type{Date} */
  @api date;
  /** @type{number} */
  @api count;
  /** @type{number} */
  @api maxCount;
  /** @type{Day} */
  @api selectedDay;
  /** @type{boolean} */
  @api selected;
  /** @type{number} */
  _count;

  today = new Date();

  get style() {
    return this.styleColor + (this.selected ? " tilewall-day_selected" : "");
  }

  get styleColor() {
    if (this._count === undefined) {
      this._count = 0;
    }
    if (this._count === 0) {
      return COLOR_NO;
    }
    if (this._count === this.maxCount && this.maxCount === 1) {
      return COLOR_WEAK;
    } else if (this._count <= this.maxCount / 2.5) {
      return COLOR_NORMAL;
    } else if (this._count === this.maxCount) {
      return COLOR_STRONG;
    }
    return COLOR_WEAK;
  }

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("dayselected", {
        detail: {
          date: this.date,
          count: this.count
        }
      })
    );
  }

  /**
   * Sets the width and height of the square.
   * @param {number} size size in pixels
   */
  @api
  setDaySize(size) {
    const el = this.template.querySelector("div");
    el.style.width = size + "px";
    el.style.height = size + "px";
  }

  connectedCallback() {
    this._count = this.count;
  }
}
