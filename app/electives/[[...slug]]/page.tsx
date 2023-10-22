import React from 'react';
import ElectiveTable from '../elective-table';
import fetchElectiveCarouselTable from '../../api/request-elective-grid';
import { fetchStudentsByPartyIDs } from '../../api/student-search';
import { Text, Title, Card } from '@tremor/react';
import { Student } from '../../tables/student-table';
import { ElectiveDTO } from '../elective-card';
import ElectiveSubscriberAccordion, {
  ElectivePreference
} from './elective-subscriber-accordion';
import { fetchElectivePreferencesByPartyIds } from '../../api/request-elective-preferences';

// Slug[0] = Year Group
// Slug[1] = Carousel number
// Slug[2] = course number

interface Props {
  params: { slug: string[] };
  searchParams: { courseId: number; carouselId: number };
}

const versionInView = 'stored';

export default async function ElectivesPage({
  params: { slug },
  searchParams: { courseId: courseId, carouselId: carouselId }
}: Props) {
  const yearGroupAsNumber: number | null =
    slug != null ? parseInt(slug[0]) : null;

  const electiveData: ElectiveDTO[][] | null =
    yearGroupAsNumber != null
      ? await fetchElectiveCarouselTable({
          yearGroup: yearGroupAsNumber,
          version: versionInView
        })
      : null;

  let lessonCycleFocus: ElectiveDTO | null = null;

  if (carouselId !== null && courseId !== null && electiveData !== null) {
    lessonCycleFocus = electiveData[courseId][carouselId];
  }

  const studentList: Student[] | null =
    lessonCycleFocus == null
      ? null
      : await fetchStudentsByPartyIDs(lessonCycleFocus.subscriberPartyIDs);

  const studentElectiveList: ElectivePreference[] | null =
    studentList == null
      ? null
      : await fetchElectivePreferencesByPartyIds(
          studentList.map((student) => student.id)
        );

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex w-full items-center justify-between">
        <Title>Carousel</Title>
        <Text>Carousel Subscription Analysis</Text>
      </div>
      <div className="flex w-full items-top justify-between pt-4">
        <Card className="flex-shrink-0 flex-grow max-w-4xl min-h-72">
          {electiveData == null ? (
            <div className="w-full flex justify-center">
              <p className="loading loading-spinner loading-md"></p>
            </div>
          ) : (
            <ElectiveTable
              electives={electiveData}
              // handleCardClick={handleCardClick}
            ></ElectiveTable>
          )}
        </Card>
        {lessonCycleFocus !== null &&
        studentList !== null &&
        studentElectiveList !== null ? (
          <Card className="max-w-sm ml-2 p-4 max-h-96 overflow-y-scroll sticky top-4">
            <ElectiveSubscriberAccordion
              lessonCycleFocus={lessonCycleFocus}
              studentList={studentList}
              electivePreferenceList={studentElectiveList}
            />
          </Card>
        ) : (
          <Card className="max-w-sm ml-2 p-4 max-h-96 overflow-y-scroll sticky top-4">
            No course selected
          </Card>
        )}
      </div>
    </main>
  );
}
