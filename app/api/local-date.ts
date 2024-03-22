import { DayOfWeek, DayOfWeekArray } from './date-and-time';

const MILLISECONDS_PER_DAY = 86_400_000;

export function getDayOfWeekAbr(dayOfWeek: number) {
  return DayOfWeekArray[dayOfWeek].toString().substring(0, 3);
}

export function createLocalDate(date: Date): LocalDate {
  let localDate = new Date(date);
  localDate.setHours(0);
  localDate.setMinutes(0);
  localDate.setSeconds(0);
  localDate.setMilliseconds(0);
  let getDayOfWeek = () => {
    let day = localDate.getDay();
    return day == 0 ? 6 : day - 1; // Zero-Indexed to Monday;
  };

  const abbrev = getDayOfWeekAbr(getDayOfWeek());

  return {
    dayOfWeek: DayOfWeekArray[getDayOfWeek()],
    dayOfWeekAbr: abbrev,
    dayOfMonth: localDate.getDate(),
    month: localDate.getMonth() + 1, // one-indexing
    year: localDate.getFullYear()
  };
}

export interface LocalDate {
  dayOfWeek: DayOfWeek;
  dayOfWeekAbr: string;
  dayOfMonth: number;
  month: number;
  year: number;
}

export function daysArithmetic(date: Date, days: number): Date {
  let number = date.getTime() + days * MILLISECONDS_PER_DAY;
  return new Date(number);
}
