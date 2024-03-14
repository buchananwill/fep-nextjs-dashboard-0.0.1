import { createContext } from 'react';
import { notAnId } from '../../api/dto-interfaces';
import { BuildMetricDto } from '../../api/dtos/BuildMetricDtoSchema';
import { TransientIdOffset } from '../../graphing/editing/graph-edits';

export const MetricsContext = createContext<BuildMetricDto>({
  scheduleId: TransientIdOffset,
  finalState: 'N/A',
  queueTreeNodes: [],
  totalAllocationLoops: NaN,
  id: notAnId
});
