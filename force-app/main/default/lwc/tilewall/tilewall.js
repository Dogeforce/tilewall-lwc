import { api, LightningElement } from "lwc";
import getAggregateData from "@salesforce/apex/TilewallController.getAggregateData";
import LOCALE from "@salesforce/i18n/locale";
import FIRSTDAYOFWEEK from "@salesforce/i18n/firstDayOfWeek";

const ONE_DAY_MILIS = 1000 * 60 * 60 * 24;
const ONE_YEAR_MILIS = 1000 * 60 * 60 * 24 * 365;
const DEFAULT_NO_OF_DAYS = 365;

export default class Tilewall extends LightningElement {
  @api recordId;
  @api flexipageRegionWidth;
  @api title;
  @api iconName;

  @api relatedObjectName;
  @api groupByFieldName;
  @api relationshipFieldName;

  @api messageTemplate;
  @api customWhereClause;
  @api showRecordListOnDayClick;

  weeks = [];
  selectedDay;
  maxRecordCount;

  get days() {
    if (!this.weeks || !this.weeks[0]) {
      return [];
    }

    let dayList = [];

    for (let day = 0; day < 7; day++) {
      dayList.push({
        name:
          day % 2 === 0
            ? Intl.DateTimeFormat(LOCALE, { weekday: "long" }).format(
                this.weeks[0].days[day].date
              )
            : ""
      });
    }

    return dayList;
  }

  get gridCSS() {
    if (this.flexipageRegionWidth === "SMALL") {
      return "tilewall-year_small slds-clearfix slds-scrollable_x";
    }
    return "slds-clearfix";
  }

  generateCalendar() {
    getAggregateData({
      recordId: this.recordId,
      relatedObjectName: this.relatedObjectName,
      groupByFieldName: this.groupByFieldName,
      relationshipFieldName: this.relationshipFieldName,
      customWhereClause: this.customWhereClause
    })
      .then((res) => {
        let today = new Date();
        let oneYearAgo = new Date(today.getTime() - ONE_YEAR_MILIS);
        let weeks = [];
        let offset = 0;
        let maxRecordCount = 0;

        if (oneYearAgo.getDay() !== FIRSTDAYOFWEEK) {
          offset = FIRSTDAYOFWEEK - oneYearAgo.getDay();
        }

        for (let day = 0; day <= DEFAULT_NO_OF_DAYS - offset; day++) {
          let weekNumber = Math.floor(day / 7);

          if (weeks[weekNumber] === undefined) {
            weeks[weekNumber] = {
              id: "week_" + (weekNumber + 1),
              days: []
            };
          }

          let thatDay = new Date(
            oneYearAgo.getTime() + ONE_DAY_MILIS * (day + offset)
          );
          let records = res.filter((el) => {
            return (
              new Date(
                new Date(el.param).getTime() +
                  thatDay.getTimezoneOffset() * 60 * 1000
              ).toDateString() === thatDay.toDateString()
            );
          });
          let count = records.length !== 0 ? records[0].amount : 0;

          weeks[weekNumber].days.push({
            id: day,
            date: thatDay,
            count: count
          });

          if (maxRecordCount < count) {
            maxRecordCount = count;
          }
        }

        this.weeks = weeks;
        this.maxRecordCount = maxRecordCount;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleDaySelected(event) {
    this.selectedDay = event.detail;

    if (this.showRecordListOnDayClick) {
      this.selectedDate = event.detail.date;
    }
  }

  connectedCallback() {
    this.generateCalendar();
  }
}
