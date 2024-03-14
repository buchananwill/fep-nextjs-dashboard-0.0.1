'use client';

import { ElectiveAvailability } from '../api/state-types';
import { matchCarouselOrdinal } from './checkElectiveAssignments';
import React, { startTransition, useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { usePathname, useRouter } from 'next/navigation';
import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';

interface OptionBlockChooserParams {
  electivePreference: ElectivePreferenceDTO;
}

export function OptionBlockChooser({
  electivePreference: {
    preferencePosition,
    courseId,
    assignedCarouselOptionId,
    userRoleId
  }
}: OptionBlockChooserParams) {
  const dispatch = useContext(ElectiveDispatchContext);
  const { electiveAvailability, electiveDtoMap } = useContext(ElectiveContext);
  const pathname = usePathname();
  const { replace } = useRouter();
  //
  // const setUnsaved = (state: boolean) => {
  //   if (state) {
  //     const params = new URLSearchParams(window.location.search);
  //
  //     // params.set('unsaved', 'true');
  //
  //     // startTransition(() => {
  //     //   replace(`${pathname}?${params.toString()}`, { scroll: false });
  //     // });
  //   }
  // };

  function handleAssignmentChange(
    studentId: number,
    preferencePosition: number,
    assignedCarouselOrdinal: number
  ) {
    dispatch({
      type: 'setCarousel',
      studentId: studentId,
      preferencePosition: preferencePosition,
      assignedCarouselOrdinal: assignedCarouselOrdinal
    });
  }

  return (
    <select
      className="select select-xs select-bordered w-16 grow-1"
      value={matchCarouselOrdinal(
        courseId,
        assignedCarouselOptionId,
        electiveDtoMap
      )}
      onChange={(e) => {
        handleAssignmentChange(
          userRoleId,
          preferencePosition,
          parseInt(e.target.value)
        );
        // setUnsaved(true);
      }}
    >
      {mapOptions(
        electiveAvailability,
        courseId,
        userRoleId,
        preferencePosition
      )}
    </select>
  );
}

function mapOptions(
  electiveAvailability: ElectiveAvailability,
  uuid: string,
  studentId: number,
  preferencePosition: number
) {
  try {
    return electiveAvailability[uuid].map(
      (carouselOrdinal, index) => {
        return (
          <option
            key={`${studentId}-${preferencePosition}-${index}`}
            className="p-0 m-0 text-left"
            value={carouselOrdinal}
          >
            {carouselOrdinal}
          </option>
        );
      }
      // }
    );
  } catch (error) {}
}
