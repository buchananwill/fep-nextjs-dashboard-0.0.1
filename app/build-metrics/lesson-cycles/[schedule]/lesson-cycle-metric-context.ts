import { createContext } from 'react';

export interface LessonCycleMetricContextData {
  costMap: Map<number, number>;
  range: number[];
}

export const LessonCycleMetricContext =
  createContext<LessonCycleMetricContextData>({
    costMap: new Map(),
    range: [0, 0]
  });
