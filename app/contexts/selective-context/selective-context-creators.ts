import { createSelectiveContext } from '../../selective-context/components/base/generic-selective-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { WorkTaskCompetencyDto } from '../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../../api/dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';

export const AssetSuitabilityListSelectiveContext =
  createSelectiveContext<AssetRoleWorkTaskSuitabilityDto[]>();
export const WorkTaskCompetencyListSelectiveContext =
  createSelectiveContext<ProviderRoleTypeWorkTaskTypeSuitabilityDto[]>();
