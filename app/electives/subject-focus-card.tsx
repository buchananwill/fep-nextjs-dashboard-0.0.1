'use client';
import { Card } from '@tremor/react';
import React from 'react';
import ElectiveSubscriberAccordion, {
  ElectiveAvailability,
  ElectivePreference
} from './elective-subscriber-accordion';
import { ElectiveDTO } from './elective-card';
import { Student } from '../tables/student-table';
import { useSearchParams } from 'next/navigation';
import { classNames } from '../utils/class-names';

interface Props {
  lessonCycleFocus: ElectiveDTO;
  studentFocus: number;
  filteredStudentList: Student[];
  electivePreferences: ElectivePreference[];
  electiveAvailability: ElectiveAvailability;
}

const SubjectFocusCard = ({
  lessonCycleFocus,
  studentFocus,
  filteredStudentList,
  electivePreferences,
  electiveAvailability
}: Props) => {
  const toolTips = useSearchParams()?.get('toolTips') == 'show';

  return (
    <Card className="max-w-sm ml-2 px-0 py-0 sticky top-4 h-min text-center">
      <div className="sticky top-0 z-10 p-0 m-2">
        <div
          className={
            toolTips
              ? 'tooltip tooltip-left before:max-w-[10vw] min-w-0 '
              : 'flex justify-center'
          }
          data-tip="Click on a course to the left to see its current subscribers."
        >
          <div className="w-64 rounded-2xl shadow p-2 m-0 text-xl font-semibold border-2">
            {lessonCycleFocus?.courseDescription || (
              <span className="italic">No course selected</span>
            )}
          </div>
        </div>
      </div>
      <div
        className={
          toolTips
            ? 'tooltip tooltip-left min-w-0 before:max-w-[10vw]'
            : 'flex justify-center'
        }
        data-tip="Radio buttons select a student to show their options. Click the name to see their full preference list"
      >
        <div className="overflow-y-scroll max-h-[60vh] border-t-2 min-w-full">
          <div className="text-center py-2 select-none px-2">
            {lessonCycleFocus !== null &&
            filteredStudentList !== null &&
            electivePreferences !== null ? (
              <ElectiveSubscriberAccordion
                lessonCycleFocus={lessonCycleFocus}
                studentFocus={studentFocus}
                studentList={filteredStudentList}
                electivePreferenceList={electivePreferences}
                electiveAvailability={electiveAvailability}
              />
            ) : (
              <div className="italic min-w-full">Please select a course.</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubjectFocusCard;
