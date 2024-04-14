import { ProviderAvailabilityDto } from '../../../api/dtos/ProviderAvailabilityDtoSchema';
import { timeToZeroIndexedEpochalDateTime } from '../../../api/date-and-time';
import { ProviderRoleAvailabilityDto } from '../../../api/dtos/ProviderRoleAvailabilityDtoSchema';

export function getStartAndEndDatesAsEpochal(
  providerAvailability: ProviderRoleAvailabilityDto
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
