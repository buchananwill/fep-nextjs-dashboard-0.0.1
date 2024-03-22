import { addDays } from 'date-fns/fp';
import { interval } from 'date-fns/interval';

export function createRangeStartingMondayThisWeek() {
  const startDateTime = new Date(Date.now());

  let localDate = createLocalDate(startDateTime);

  let firstDayInWeek = addDays(-localDate.dayOfWeek.valueOf())(startDateTime);

  const addSixDays = addDays(6);

  let lastDayInWeek = addSixDays(firstDayInWeek);

  return interval(firstDayInWeek, lastDayInWeek);
}