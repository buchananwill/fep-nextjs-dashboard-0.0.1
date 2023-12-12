'use client';

import {
  LessonCycleMetricContext,
  LessonCycleMetricContextData
} from './lesson-cycle-metric-context';
import { ReactNode } from 'react';

export default function LessonCycleMetricContextProvider({
  children,
  computedContext
}: {
  children: ReactNode;
  computedContext: LessonCycleMetricContextData;
}) {
  return (
    <LessonCycleMetricContext.Provider value={computedContext}>
      {children}
    </LessonCycleMetricContext.Provider>
  );
}
