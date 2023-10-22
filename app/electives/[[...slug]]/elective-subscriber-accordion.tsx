import React from 'react';
import { Badge, Title } from '@tremor/react';
import { ElectiveDTO } from '../elective-card';
import { Student } from '../../tables/student-table';

export interface ElectivePreference {
  partyId: number;
  courseDescription: string;
  preferencePosition: number;
  assignedCarousel: number;
}

interface Props {
  lessonCycleFocus: ElectiveDTO;
  studentList: Student[];
  electivePreferenceList: ElectivePreference[];
}

const ElectiveSubscriberAccordion = ({
  lessonCycleFocus,
  studentList,
  electivePreferenceList
}: Props) => {
  const electivePreferences: ElectivePreference[][] = studentList.map(
    (student) =>
      electivePreferenceList.filter(
        (ePreference) => ePreference.partyId === student.id
      )
  );

  return (
    <>
      <Title>{lessonCycleFocus.courseDescription}</Title>
      <div className="pb-4">
        {studentList.map((student, index) => (
          <div
            key={student.id}
            tabIndex={index}
            className="gap-0 collapse bg-base-200 py-0 px-2 m-0.5"
          >
            <div className="collapse-title font-medium text-sm m-0 gap-0 py-2 min-h-0">
              {student.name}
            </div>
            <div className="collapse-content m-0 text-sm py-0 min-h-0">
              <ol className="list-decimal ml-2 w-max">
                {electivePreferences[index].map(
                  ({
                    preferencePosition,
                    courseDescription,
                    assignedCarousel
                  }) => (
                    <li key={preferencePosition} className="">
                      {courseDescription}{' '}
                      <Badge
                        size="xs"
                        color={assignedCarousel >= 0 ? 'emerald' : 'red'}
                      >
                        {assignedCarousel >= 0 ? `Y: ${assignedCarousel}` : 'N'}
                      </Badge>
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ElectiveSubscriberAccordion;
