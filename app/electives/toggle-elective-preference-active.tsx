import { ElectivePreferenceDTO } from '../api/dto-interfaces';
import React, { startTransition, useContext } from 'react';
import { ElectiveDispatchContext } from './elective-context';
import { usePathname, useRouter } from 'next/navigation';

export function ToggleElectivePreferenceActive({
  electivePreferenceDTOS,
  electivePreference
}: {
  electivePreferenceDTOS: ElectivePreferenceDTO[];
  electivePreference: ElectivePreferenceDTO;
}) {
  const dispatch = useContext(ElectiveDispatchContext);
  const { replace } = useRouter();
  const pathname = usePathname();

  const setUnsaved = (state: boolean) => {
    if (state) {
      const params = new URLSearchParams(window.location.search);

      params.set('unsaved', 'true');

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  };

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
      className="toggle toggle-success ml-2"
      defaultChecked={
        electivePreferenceDTOS[electivePreference.preferencePosition - 1].active
      } // preferencePosition is one-indexed
      onClick={() => {
        handleToggleClick(
          electivePreference.userRoleId,
          electivePreference.preferencePosition
        );
        setUnsaved(true);
      }}
    ></input>
  );
}