import { api, LightningElement } from 'lwc';
import LOCALE from '@salesforce/i18n/locale'

export default class TilewallDayDetail extends LightningElement {
    @api day // { date, count }
    @api template

    get data() {
        return this.day !== undefined
    }

    get text() {
        if (this.template === undefined) {
            this.template = 'Selected {1}. Count: {0}.'
        }
        return this.template.replace('{0}', this.day.count).replace('{1}', Intl.DateTimeFormat(LOCALE).format(this.day.date))
    }
}