import { api, LightningElement } from 'lwc';
import getAggregateData from "@salesforce/apex/TilewallController.getAggregateData";
import LOCALE from '@salesforce/i18n/internationalizationProperty'

const ONE_DAY_MILIS = 1000 * 60 * 60 * 24
const ONE_YEAR_MILIS = 1000 * 60 * 60 * 24 * 365

export default class Tilewall extends LightningElement {
    @api recordId
    @api flexipageRegionWidth
    @api title
    @api iconName

    @api relatedObjectName
    @api groupByFieldName
    @api relationshipFieldName

    @api messageTemplate

    weeks = []
    selectedDay

    get days() {
        if (this.weeks && this.weeks[0]) {
            let dayList = []
            for (let day = 0; day < 7; day++) {
                dayList.push({
                    name: day % 2 == 0
                        ? Intl.DateTimeFormat(LOCALE, { weekday: "long" }).format(this.weeks[0].days[day].date)
                        : ''
                })
            }
            return dayList
        }
    }

    get gridCSS() {
        if (this.flexipageRegionWidth == 'SMALL') {
            return 'tilewall-year_small slds-clearfix slds-scrollable_x'
        }
        return 'slds-clearfix'
    }

    generateCalendar() {
        getAggregateData({
            recordId: this.recordId,
            relatedObjectName: this.relatedObjectName,
            groupByFieldName: this.groupByFieldName,
            relationshipFieldName: this.relationshipFieldName
        }).then(res => {
            console.log(JSON.parse(JSON.stringify(res)))
            let today = new Date()
            let oneYearAgo = new Date(today.getTime() - ONE_YEAR_MILIS)
            let weeks = []
            for (let day = 0; day <= (365 + oneYearAgo.getDay() * 1); day++) {
                let weekNumber = Math.floor(day / 7)
                if (weeks[weekNumber] === undefined) {
                    weeks[weekNumber] = {
                        id: 'week_' + weekNumber,
                        days: []
                    }
                }
                let thatDay = new Date(oneYearAgo.getTime() + (ONE_DAY_MILIS * day))
                let records = res.filter(el => {
                    return new Date(el.param).toDateString() == thatDay.toDateString()
                })
                let count = records.length != 0 ? records[0].amount : 0
                weeks[weekNumber].days.push({
                    id: day,
                    date: new Date(oneYearAgo.getTime() + ONE_DAY_MILIS * day),
                    count: count
                })
            }
            this.weeks = weeks
        }).catch(err => {
            console.error(err)
        })
    }

    handleDaySelected(event) {
        this.selectedDay = event.detail
    }

    connectedCallback() {
        this.generateCalendar()
    }
}