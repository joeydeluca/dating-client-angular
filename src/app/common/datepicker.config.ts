import {IMyDpOptions} from 'mydatepicker';

export class DatepickerConfig {
  static config: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    showTodayBtn: false,
    minYear: 1920,
    maxYear: new Date().getFullYear() - 18,
    disableUntil: {year: 1920, month: 1, day: 31},
    disableSince: {year: new Date().getFullYear() - 18, month: new Date().getMonth(), day: new Date().getDay()},
    showClearDateBtn: false,
    editableDateField: false,
    openSelectorOnInputClick: true
  };
}
