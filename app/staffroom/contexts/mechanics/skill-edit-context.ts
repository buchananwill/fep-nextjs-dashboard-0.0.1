import { createContext } from 'react';
import { MechanicDto, ServiceCompetencyDto } from '../../../api/zod-mods';

interface SkillEditContext {
  triggerModal: (skill: ServiceCompetencyDto, mechanic: MechanicDto) => void;
}

const defaultContext = {
  triggerModal: () => {}
};

export const SkillEditContext = createContext<SkillEditContext>(defaultContext);
