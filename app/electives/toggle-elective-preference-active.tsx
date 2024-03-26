import React, { useContext } from 'react';
import { ElectiveDispatchContext } from './elective-context';
import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';

export function ToggleElectivePreferenceActive({
  electivePreferenceDTOS,
  electivePreference
}: {
  electivePreferenceDTOS: ElectivePreferenceDTO[];
  electivePreference: ElectivePreferenceDTO;
}) {
  const dispatch = useContext(ElectiveDispatchContext);

  function handleToggleClick(studentId: number, preferencePosition: number) {
    dispatch({
      type: 'setActive',
      studentId: studentId,
      preferencePosition: preferencePosition
    });
  }

  return (
    <input
      type="checkbox"
      className="toggle toggle-success ml-2 min-h-0"
      defaultChecked={
        electivePreferenceDTOS[electivePreference.preferencePosition - 1].active
      } // preferencePosition is one-indexed
      onClick={() => {
        handleToggleClick(
          electivePreference.userRoleId,
          electivePreference.preferencePosition
        );
      }}
    ></input>
  );
}
