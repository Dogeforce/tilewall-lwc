import { api, LightningElement } from 'lwc';

export default class TilewallDay extends LightningElement {
    @api date
    @api count

    today = new Date()

    get style() {
        if (this.count === undefined) {
            this.count = 0
        }
        if (this.count == 0) {
            return 'tilewall-day tilewall-day_count-default'
        }
        else if (this.count == 1) {
            return 'tilewall-day tilewall-day_count-low'
        }
        else if (this.count <= 3) {
            return 'tilewall-day tilewall-day_count-medium'
        }
        return 'tilewall-day tilewall-day_count-high'
    }

    handleClick(_event) {
        this.dispatchEvent(new CustomEvent('dayselected', { detail: {
            date: this.date,
            count: this.count
        }}))
    }
}