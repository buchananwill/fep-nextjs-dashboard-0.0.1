import { createContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';

interface SkillEditContext {
  triggerModal: (
    skill: WorkTaskCompetencyDto,
    providerRoleDto: ProviderRoleDto
  ) => void;
}

const defaultContext = {
  triggerModal: () => {}
};

export const SkillEditContext = createContext<SkillEditContext>(defaultContext);
