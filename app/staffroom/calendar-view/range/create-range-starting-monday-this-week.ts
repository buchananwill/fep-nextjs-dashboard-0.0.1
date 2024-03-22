import { addDays } from 'date-fns/fp';
import { interval } from 'date-fns/interval';
import { createLocalDate } from '../../../api/local-date';
import {
  DayOfWeekArray,
  PROJECT_EPOCH_DATE_TIME
} from '../../../api/date-and-time';

export function createRangeStartingMondayThisWeek() {
  const startDateTime = new Date(Date.now());

  let localDate = createLocalDate(startDateTime);

  let firstDayInWeek = addDays(-DayOfWeekArray.indexOf(localDate.dayOfWeek))(
    startDateTime
  );

  const addSixDays = addDays(6);

  let lastDayInWeek = addSixDays(firstDayInWeek);

  return interval(firstDayInWeek, lastDayInWeek);
}
export function createRangeStartingMondayEpochalTime() {
  const startDateTime = PROJECT_EPOCH_DATE_TIME;

  let localDate = createLocalDate(startDateTime);

  let firstDayInWeek = addDays(-DayOfWeekArray.indexOf(localDate.dayOfWeek))(
    startDateTime
  );

  const addSixDays = addDays(6);

  let lastDayInWeek = addSixDays(firstDayInWeek);

  return interval(firstDayInWeek, lastDayInWeek);
}
