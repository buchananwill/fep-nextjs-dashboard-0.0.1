import { useMemo } from 'react';
import { interval } from 'date-fns/interval';

export function useMemoizedNormalizedInterval(start: number, end: number) {
  return useMemo(() => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return interval(startDate, endDate);
  }, [start, end]);
}