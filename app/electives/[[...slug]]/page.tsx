import React from 'react';
import ElectiveTable from '../elective-table';
import fetchElectiveCarouselTable from '../../api/request-elective-grid';
import { fetchStudentsByPartyIDs } from '../../api/student-search';
import { Text, Title, Card } from '@tremor/react';
import { Student } from '../../tables/student-table';
import { ElectiveDTO } from '../elective-card';
import ElectiveSubscriberAccordion, {
  ElectivePreference
} from '../elective-subscriber-accordion';
import { fetchElectivePreferencesByPartyIds } from '../../api/request-elective-preferences';
import { getNumberParam } from '../../utils/type-casting';

// Slug[0] = Year Group

interface Props {
  params: { slug: string[] };
  searchParams: {
    courseId: string;
    carouselId: string;
    partyId: string;
  };
}

const versionInView = 'stored';

export default async function ElectivesPage({
  params: { slug },
  searchParams: {
    courseId: courseIdString,
    carouselId: carouselIdString,
    partyId: partyIdString
  }
}: Props) {
  const yearGroupAsNumber: number | null =
    slug != null ? parseInt(slug[0]) : null;

  // console.log(carouselIdString, courseIdString, partyIdString);

  // const courseIdValue: number | null= getNumberParam(courseIdString);

  // const carouselIdValue: number | null = getNumberParam(carouselIdString);

  // const partyIdValue: number | null = getNumberParam(partyIdString);

  const courseId = parseInt(courseIdString);
  // courseIdValue !== null ? courseIdValue : -1
  const carouselId = parseInt(carouselIdString);
  // carouselIdValue !== null ? carouselIdValue : -1
  const partyId = parseInt(partyIdString);
  // partyIdValue !== null ? partyIdValue : -1

  console.log(courseId, carouselId, partyId);

  const electiveData: ElectiveDTO[][] | null =
    yearGroupAsNumber != null
      ? await fetchElectiveCarouselTable({
          yearGroup: yearGroupAsNumber,
          version: versionInView
        })
      : null;

  let lessonCycleFocus: ElectiveDTO | null = null;

  lessonCycleFocus = electiveData?.[courseId]?.[carouselId] || null;

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
              <p>Please select a year group to view their electives.</p>
            </div>
          ) : (
            <ElectiveTable
              electives={electiveData}
              partyId={partyId}
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
              studentFocus={partyId}
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
