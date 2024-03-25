import { createSelectiveContext } from '../generic/generic-selective-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';

export const AssetSuitabilityListSelectiveContext =
  createSelectiveContext<AssetRoleWorkTaskSuitabilityDto[]>();
