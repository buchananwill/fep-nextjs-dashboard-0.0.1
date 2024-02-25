import { produce } from 'immer';
import { addDays } from 'date-fns/fp';
import { addMinutes, clamp, subDays } from 'date-fns';
import { NormalizedInterval } from 'date-fns/types';
import { interval } from 'date-fns/interval';

export const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export interface SetStartDate {
  type: 'setStartDate';
  updatedStartDate: Date;
}
export interface SetEndDate {
  type: 'setEndDate';
  updatedEndDate: Date;
}
export interface ArithmeticByDays {
  type: 'arithmeticByDays';
  amount: number;
}

export interface SetRange {
  type: 'setRange';
  range: NormalizedInterval | undefined;
}

export type CalendarRangeStateActions =
  | SetStartDate
  | SetEndDate
  | ArithmeticByDays
  | SetRange;

export default function calendarRangeReducers(
  calendarRangeState: NormalizedInterval,
  action: CalendarRangeStateActions
) {
  switch (action.type) {
    case 'setStartDate': {
      const { updatedStartDate } = action;
      if (!calendarRangeState) {
        let endDate = addDays(1)(updatedStartDate);
        return { start: updatedStartDate, end: endDate };
      } else
        return produce(calendarRangeState, (draft) => {
          draft.start = updatedStartDate;
        });
    }
    case 'setEndDate': {
      const { updatedEndDate } = action;
      if (!calendarRangeState) {
        let startDate = addDays(-1)(updatedEndDate);
        return { start: startDate, end: updatedEndDate };
      } else
        return produce(calendarRangeState, (draft) => {
          draft.end = updatedEndDate;
        });
    }
    case 'arithmeticByDays': {
      const { amount } = action;
      const { start, end } = calendarRangeState;
      let deltaDays = addDays(amount);

      return produce(calendarRangeState, (draft) => {
        draft.start = deltaDays(start);
        draft.end = deltaDays(end);
      });
    }
    case 'setRange': {
      const { range } = action;

      if (!range) {
        const end = addMinutes(calendarRangeState.start, 23 * 60 + 59);
        return produce(calendarRangeState, (draft) => {
          draft.end = end;
        });
      } else {
        if (range.start.getDate() == calendarRangeState.start.getDate()) {
          return produce(calendarRangeState, (draft) => {
            const startLimit = subDays(range.end, 13);
            const dateNormalizedInterval = interval(startLimit, range.end);
            draft.start = clamp(range.start, dateNormalizedInterval);
            draft.end = range.end;
          });
        } else {
          return produce(calendarRangeState, (draft) => {
            const endLimit = addDays(13)(range.start);
            const dateNormalizedInterval = interval(range.start, endLimit);
            draft.start = range.start;
            draft.end = clamp(range.end, dateNormalizedInterval);
          });
        }
      }
    }
  }
}
