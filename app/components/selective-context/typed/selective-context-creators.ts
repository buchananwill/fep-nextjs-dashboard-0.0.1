import { createSelectiveContext } from '../../../generic/components/selective-context/generic-selective-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';

export const AssetSuitabilityListSelectiveContext =
  createSelectiveContext<AssetRoleWorkTaskSuitabilityDto[]>();
export const WorkTaskCompetencyListSelectiveContext =
  createSelectiveContext<WorkTaskCompetencyDto[]>();
