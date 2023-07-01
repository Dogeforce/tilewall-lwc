import { api, LightningElement } from "lwc";
import LOCALE from "@salesforce/i18n/locale";

const DEFAULT_TEXT = "Selected {1}. Count: {0}.";

export default class TilewallDayDetail extends LightningElement {
  @api day; // { date, count }
  @api template;
  _template;

  get data() {
    return this.day !== undefined;
  }

  get text() {
    if (this._template === undefined) {
      this._template = DEFAULT_TEXT;
    }
    return this._template
      .replace("{0}", this.day.count)
      .replace("{1}", Intl.DateTimeFormat(LOCALE).format(this.day.date));
  }

  connectedCallback() {
    this._template = this.template;
  }
}
