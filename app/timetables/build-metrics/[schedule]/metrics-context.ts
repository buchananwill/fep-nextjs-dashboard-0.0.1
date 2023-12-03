import { createContext } from 'react';
import { BuildMetricDTO, notAnId } from '../../../api/dto-interfaces';

export const MetricsContext = createContext<BuildMetricDTO>({
  id: notAnId
});
