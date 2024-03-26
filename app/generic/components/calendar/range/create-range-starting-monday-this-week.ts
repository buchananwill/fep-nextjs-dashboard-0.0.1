import { addDays } from 'date-fns/fp';
import { interval } from 'date-fns/interval';
import { createLocalDate } from '../../../../api/local-date';
import {
  DayOfWeekArray,
  PROJECT_EPOCH_DATE_TIME_MONDAY
} from '../../../../api/date-and-time';
import { addMinutes } from 'date-fns';

const MinutesInADay = 24 * 60;

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
export function createRangeStartingEpochalTime(
  length: number,
  dayZero: string // TODO: Allow different cycle day zero.
) {
  const startDateTime = PROJECT_EPOCH_DATE_TIME_MONDAY;

  const addedDays = addDays(length - 1);

  let lastDayInWeek = addedDays(startDateTime);

  const endOfRange = addMinutes(lastDayInWeek, MinutesInADay - 1);

  return interval(startDateTime, endOfRange);
}
