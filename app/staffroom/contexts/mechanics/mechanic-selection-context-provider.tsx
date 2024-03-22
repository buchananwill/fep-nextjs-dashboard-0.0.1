'use client';

import { ReactNode, useState } from 'react';
import { NameIdNumberTuple } from '../../../api/zod-mods';
import { TeacherSelectionContext } from './teacher-selection-context';
import { produce } from 'immer';

export default function MechanicSelectionContextProvider({
  children,
  initialSelection
}: {
  children: ReactNode;
  initialSelection?: NameIdNumberTuple[];
}) {
  const [selectedMechanics, setSelectedMechanics] = useState(
    initialSelection || []
  );

  const toggleMechanicSelection = (selectedMechanic: NameIdNumberTuple) => {
    const draft = [];
    let found = false;
    for (let otherMechanic of selectedMechanics) {
      if (selectedMechanic.id == otherMechanic.id) {
        found = true;
      } else {
        draft.push(otherMechanic);
      }
    }
    if (!found) {
      draft.push(selectedMechanic);
    }
    setSelectedMechanics(draft);
  };

  const clearSelectedMechanics = () => {
    setSelectedMechanics([]);
  };

  return (
    <TeacherSelectionContext.Provider
      value={{
        selectedProviders: selectedMechanics,
        toggleProviderSelection: toggleMechanicSelection,
        clearAllSelections: clearSelectedMechanics
      }}
    >
      {children}
    </TeacherSelectionContext.Provider>
  );
}
