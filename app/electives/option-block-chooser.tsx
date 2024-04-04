'use client';

import { ElectiveAvailability } from '../api/state-types';
import { matchCarouselOrdinal } from './checkElectiveAssignments';
import React, { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
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
      className="w-10 border-1 rounded-md"
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
      }}
    >
      {electiveAvailability[courseId].map((carouselOrdinal, index) => {
        return (
          <option
            key={`${userRoleId}-${preferencePosition}-${index}`}
            className="p-0 m-0 text-left"
            value={carouselOrdinal}
          >
            {carouselOrdinal}
          </option>
        );
      })}
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
    return;
  } catch (error) {}
}
