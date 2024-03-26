'use client';

import { ReactNode, useState } from 'react';

import { ProviderRoleSelectionContext } from './provider-role-selection-context';
import { LongIdStringNameTuple } from '../../../api/dtos/LongIdStringNameTupleSchema';

export default function ProviderRoleSelectionContextProvider({
  children,
  initialSelection
}: {
  children: ReactNode;
  initialSelection?: LongIdStringNameTuple[];
}) {
  const [selectedProviderRoles, setSelectedProviderRoles] = useState(
    initialSelection || []
  );

  const toggleProviderRoleSelection = (
    selectedMechanic: LongIdStringNameTuple
  ) => {
    const draft = [];
    let found = false;
    for (let otherMechanic of selectedProviderRoles) {
      if (selectedMechanic.id == otherMechanic.id) {
        found = true;
      } else {
        draft.push(otherMechanic);
      }
    }
    if (!found) {
      draft.push(selectedMechanic);
    }
    setSelectedProviderRoles(draft);
  };

  const clearSelectedProviderRoles = () => {
    setSelectedProviderRoles([]);
  };

  return (
    <ProviderRoleSelectionContext.Provider
      value={{
        selectedProviders: selectedProviderRoles,
        toggleProviderSelection: toggleProviderRoleSelection,
        clearAllSelections: clearSelectedProviderRoles
      }}
    >
      {children}
    </ProviderRoleSelectionContext.Provider>
  );
}
