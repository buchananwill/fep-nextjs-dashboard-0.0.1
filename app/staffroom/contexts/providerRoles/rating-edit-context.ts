import { createContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { AssetRoleWorkTaskSuitabilityDto } from '../../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { AssetDto } from '../../../api/dtos/AssetDtoSchema';

export interface RatingEditContext<R, E> {
  triggerModal: (skill: R, providerRoleDto: E) => void;
}

const defaultContext = {
  triggerModal: () => {}
};

export const SkillEditContext =
  createContext<RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>>(
    defaultContext
  );
export const AssetSuitabilityEditContext =
  createContext<RatingEditContext<AssetRoleWorkTaskSuitabilityDto, AssetDto>>(
    defaultContext
  );
