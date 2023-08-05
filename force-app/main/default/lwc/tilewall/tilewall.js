import { api, LightningElement } from "lwc";
import getAggregateData from "@salesforce/apex/TilewallController.getAggregateData";
import LOCALE from "@salesforce/i18n/locale";
import FIRSTDAYOFWEEK from "@salesforce/i18n/firstDayOfWeek";

const ONE_DAY_MILIS = 1000 * 60 * 60 * 24;
const ONE_YEAR_MILIS = 1000 * 60 * 60 * 24 * 365;
const DEFAULT_NO_OF_DAYS = 365;
const MARGIN_PX = 3;
const NO_OF_WEEKS = 52;
const AFTER_RENDER_WAIT_TIME_MILIS = 500;

export default class Tilewall extends LightningElement {
  /** @type{string} */
  @api recordId;
  /** @type{string} */
  @api flexipageRegionWidth;
  /** @type{string} */
  @api titleLabel;
  /** @type{string} */
  @api iconName;

  /** @type{string} */
  @api relatedObjectName;
  /** @type{string} */
  @api groupByFieldName;
  /** @type{string} */
  @api relationshipFieldName;

  /** @type{string} */
  @api messageTemplate;
  /** @type{string} */
  @api customWhereClause = "";
  /** @type{boolean} */
  @api showRecordListOnDayClick;
  /** @type{boolean} */
  @api hideConfigErrorMessages;

  /** @type{Week[]} */
  weeks = [];
  /** @type{Day} */
  selectedDay;
  /** @type{Number} */
  maxRecordCount;
  /** @type{Day[]} */
  days = [];
  /** @type{boolean} */
  resizedOnInit = false;

  get gridCSS() {
    if (this.flexipageRegionWidth === "SMALL") {
      return "tilewall-year_small slds-clearfix";
    }
    return "slds-clearfix";
  }

  get showRelatedRecordsList() {
    return (
      this.showRecordListOnDayClick &&
      this.relatedObjectName &&
      this.selectedDate
    );
  }

  setupDays() {
    if (!this.weeks || !this.weeks[0]) {
      return;
    }

    let dayList = [];

    for (let dayNo = 0; dayNo < 7; dayNo++) {
      dayList.push({
        name:
          dayNo % 2 === 0
            ? Intl.DateTimeFormat(LOCALE, { weekday: "long" }).format(
                this.weeks[0].days[dayNo].date
              )
            : "",
        no: dayNo
      });
    }

    this.days = dayList;
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

        this.setupDays(); // sets up the day names
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleDaySelected(event) {
    this.selectedDay = event.detail;

    if (this.showRecordListOnDayClick) {
      /** @type{RelatedRecordsList} */
      const relatedRecordList = this.template.querySelector(
        "c-related-records-list"
      );

      this.selectedDate = this.selectedDay.date;

      if (relatedRecordList) {
        relatedRecordList.date = this.selectedDate;
      }
    }

    /** @type {NodeListOf} */
    const days = this.template.querySelectorAll("c-tilewall-day");

    if (!days) {
      return;
    }

    days.forEach((day) => {
      day.selected = day.date === this.selectedDate;
    });
  }

  /**
   * Handles the resize event.
   */
  resize() {
    const weeksContainer = this.template.querySelector(
      `[data-id="weeks-container"]`
    );
    const weekNamesContainer = this.template.querySelector(
      `[data-id="week-names-container"]`
    );
    const weeksContainerWidth = weeksContainer.getBoundingClientRect().width;
    const weekNamesContainerWidth =
      weekNamesContainer.getBoundingClientRect().width;

    // with a margin of 3px to the left per week, we can calculate the size of the day square
    const daySquareSize =
      (weeksContainerWidth - weekNamesContainerWidth) / NO_OF_WEEKS -
      MARGIN_PX -
      1;

    // query all days and set the size
    /** @type{NodeListOf<TilewallDay>} */
    const days = this.template.querySelectorAll(`[data-name="day"]`);

    days.forEach((day) => {
      day.setDaySize(daySquareSize);
    });

    // sets the height of the week name containers so they are aligned with the changes
    /** @type{NodeListOf<HTMLElement>} */
    const weekNamesContainers =
      this.template.querySelectorAll(".tilewall-day_name");

    weekNamesContainers.forEach((el) => {
      el.style.height = `${daySquareSize + MARGIN_PX}px`;
    });
  }

  connectedCallback() {
    this.generateCalendar();
    window.addEventListener("resize", this.resize.bind(this));
  }

  renderedCallback() {
    if (!this.resizedOnInit) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.resize();
      }, AFTER_RENDER_WAIT_TIME_MILIS);
      this.resizedOnInit = true;
    }
  }
}
