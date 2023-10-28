'use client';
import { Card } from '@tremor/react';
import React, { useContext, useEffect, useState } from 'react';
import ElectiveSubscriberAccordion, {
  ElectiveAvailability
} from './elective-subscriber-accordion';
import { ElectiveDTO } from './elective-card';
import { useSearchParams } from 'next/navigation';
import { ElectivesContext } from './electives-context';
import { ElectiveState } from './elective-reducers';
import { Student } from '../tables/student-table';

interface Props {
  electiveDTOList: ElectiveDTO[];

  electiveAvailability: ElectiveAvailability;
}

function getElectiveDTO(
  electiveDTOList: ElectiveDTO[],
  carouselId: number,
  courseUUID: string
) {
  return electiveDTOList.find(
    (electiveDTO) =>
      electiveDTO.carouselId == carouselId &&
      electiveDTO.courseUUID == courseUUID
  );
}

const SubjectFocusCard = ({ electiveDTOList, electiveAvailability }: Props) => {
  const toolTips = useSearchParams()?.get('toolTips') == 'show';
  const [courseFocus, setCourseFocus] = useState<ElectiveDTO | null>();
  const { carouselId, courseId } = useContext(ElectivesContext);

  useEffect(() => {
    const electiveDTO = getElectiveDTO(electiveDTOList, carouselId, courseId);
    setCourseFocus(electiveDTO);
  }, [carouselId, courseId, electiveDTOList]);

  return (
    <Card className="max-w-sm ml-2 p-0 sticky top-4 h-min text-center">
      <div className="sticky top-0 z-10 p-0 m-2">
        <div
          className={
            toolTips
              ? 'tooltip tooltip-left before:max-w-[10vw] '
              : 'flex justify-center min-w-0'
          }
          data-tip="Click on a course to the left to see its current subscribers."
        >
          <div className="w-64 rounded-2xl shadow p-2 m-0 text-xl font-semibold border-2">
            Filtered Students
          </div>
        </div>
      </div>
      <div
        className={
          toolTips
            ? 'tooltip tooltip-left before:max-w-[15vw] min-w-full inline before:-translate-x-32 after:-translate-x-32 before:-translate-y-12'
            : 'flex justify-center'
        }
        data-tip="Radio buttons select a student to show their options. Click the name to see their full preference list"
      >
        <div className="relative overflow-y-scroll max-h-[65vh] border-t-2 min-w-full py-2">
          <div className="text-center py-2 select-none px-2">
            {electiveDTOList !== null ? (
              <ElectiveSubscriberAccordion
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
