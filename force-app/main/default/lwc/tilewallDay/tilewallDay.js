import { api, LightningElement } from 'lwc';

const COLOR_NO = 'tilewall-day tilewall-day_count-default';
const COLOR_WEAK = 'tilewall-day tilewall-day_count-low';
const COLOR_NORMAL = 'tilewall-day tilewall-day_count-medium';
const COLOR_STRONG = 'tilewall-day tilewall-day_count-high';

export default class TilewallDay extends LightningElement {
    @api date;
    @api count;
    @api maxCount;

    today = new Date();

    get style() {
        if (this.count === undefined) {
            this.count = 0;
        }
        if (this.count == 0) {
            return COLOR_NO;
        }
        if (this.count == this.maxCount && this.maxCount == 1) {
            return COLOR_WEAK;
        }
        else if (this.count <= this.maxCount / 2.5) {
            return COLOR_NORMAL;
        }
        else if (this.count == this.maxCount) {
            return COLOR_STRONG;
        }
        return COLOR_WEAK;
    }

    handleClick(_event) {
        this.dispatchEvent(new CustomEvent('dayselected', { detail: {
            date: this.date,
            count: this.count
        }}));
    }
}