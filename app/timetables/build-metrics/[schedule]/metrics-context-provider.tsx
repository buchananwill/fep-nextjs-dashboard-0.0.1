'use client';

import { BuildMetricDTO } from '../../../api/dto-interfaces';
import { ReactNode } from 'react';
import { MetricsContext } from './metrics-context';

interface Props {
  buildMetricDto: BuildMetricDTO;
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
