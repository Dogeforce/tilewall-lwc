/* eslint-disable */
interface RelatedRecordsList extends Element {
    date: Date;
}

interface TilewallDay extends Element {
    date: Date;
    selected: boolean;
}

declare module "@salesforce/i18n/locale" {
    const LOCALE: string;
    export default LOCALE;
}

declare module "@salesforce/i18n/firstDayOfWeek" {
    const FIRSTDAYOFWEEK: number;
    export default FIRSTDAYOFWEEK;
}

interface Day {
    name: string;
    no: number;
    date?: Date
}

interface Week {
    id: string;
    days: Day[];
}

interface TilewallDay {
    setDaySize(size: number): void;
}