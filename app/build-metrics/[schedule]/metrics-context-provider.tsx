'use client';

import { ReactNode } from 'react';
import { MetricsContext } from './metrics-context';
import { BuildMetricDto } from '../../api/dtos/BuildMetricDtoSchema';

interface Props {
  buildMetricDto: BuildMetricDto;
  children: ReactNode;
}

export default function MetricsContextProvider({
  buildMetricDto,
  children
}: Props) {
  return (
    <MetricsContext.Provider value={buildMetricDto}>
      {children}
    </MetricsContext.Provider>
  );
}
