import { createContext } from 'react';
import { LongIdStringNameTuple } from '../../../api/dtos/LongIdStringNameTupleSchema';

export interface ProviderSelectionContext {
  selectedProviders: LongIdStringNameTuple[];
  toggleProviderSelection: (selectedProvider: LongIdStringNameTuple) => void;
  clearAllSelections: () => void;
}

export const TeacherSelectionContext = createContext<ProviderSelectionContext>({
  selectedProviders: [],
  toggleProviderSelection: (selectedMechanic) => {},
  clearAllSelections: () => {}
});
