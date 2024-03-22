import { createContext } from 'react';

import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';

export interface ProviderRoleContextInterface {
  providers: ProviderRoleDto[];
  setProviders: (mechanics: ProviderRoleDto[]) => void;
  workTaskTypes: WorkTaskTypeDto[];
  unsavedChanges: boolean;
  setUnsavedChanges: (update: boolean) => void;
}

export interface ProviderRoleAndTaskData {
  providerRoles: ProviderRoleDto[];
  workTaskTypes: WorkTaskTypeDto[];
}

export const ProviderContext = createContext<ProviderRoleContextInterface>({
  providers: [],
  workTaskTypes: [],
  setProviders: () => {},
  unsavedChanges: false,
  setUnsavedChanges: () => {}
});
