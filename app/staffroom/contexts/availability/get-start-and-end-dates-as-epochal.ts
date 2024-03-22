import { ProviderAvailabilityDto } from '../../../api/dtos/ProviderAvailabilityDtoSchema';
import { timeToZeroIndexedEpochalDateTime } from '../../../api/date-and-time';

export function getStartAndEndDatesAsEpochal(
  providerAvailability: ProviderAvailabilityDto
) {
  const {
    cycleSubspanDto: { start, end, zeroIndexedCycleDay }
  } = providerAvailability;
  const startDate = timeToZeroIndexedEpochalDateTime(
    start,
    zeroIndexedCycleDay
  );
  const endDate = timeToZeroIndexedEpochalDateTime(end, zeroIndexedCycleDay);
  return { startDate, endDate };
}
