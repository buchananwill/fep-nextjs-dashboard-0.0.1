import { createContext } from 'react';
import { LongIdStringNameTuple } from '../../../api/dtos/LongIdStringNameTupleSchema-Validation';

export interface ProviderRoleSelectionInterface {
  selectedProviders: LongIdStringNameTuple[];
  toggleProviderSelection: (selectedProvider: LongIdStringNameTuple) => void;
  clearAllSelections: () => void;
}

export const ProviderRoleSelectionContext =
  createContext<ProviderRoleSelectionInterface>({
    selectedProviders: [],
    toggleProviderSelection: (selectedMechanic) => {},
    clearAllSelections: () => {}
  });
