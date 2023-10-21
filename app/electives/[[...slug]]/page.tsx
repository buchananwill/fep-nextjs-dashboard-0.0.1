import React from 'react';
import ElectiveTable from '../elective-table';
import fetchElectiveCarouselTable from '../../api/request-elective-grid';
import { fetchStudentsByPartyIDs } from '../../api/student-search';
import { Button, Text, Title, Card } from '@tremor/react';
import { Student } from '../../tables/student-table';
import { ElectiveDTO } from '../elective-card';

// Slug[0] = Year Group
// Slug[1] = Carousel number
// Slug[2] = course number

interface Props {
  params: { slug: string[] };
}

const versionInView = 'stored';

export default async function ElectivesPage({ params: { slug } }: Props) {
  const yearGroupAsNumber: number | null =
    slug != null ? parseInt(slug[0]) : null;

  let carouselNumber: null | number = null;
  let courseNumber: null | number = null;

  if (slug && slug[1] && slug[2]) {
    carouselNumber = parseInt(slug[1], 10);
    courseNumber = parseInt(slug[2], 10);
  }

  const electiveData: ElectiveDTO[][] | null =
    yearGroupAsNumber != null
      ? await fetchElectiveCarouselTable({
          yearGroup: yearGroupAsNumber,
          version: versionInView
        })
      : null;

  let lessonCycleFocus: ElectiveDTO | null = null;

  if (
    carouselNumber !== null &&
    courseNumber !== null &&
    electiveData !== null
  ) {
    lessonCycleFocus = electiveData[courseNumber][carouselNumber];
  }

  const studentList: Student[] = await fetchStudentsByPartyIDs([1]);

  // if (electiveData == null) {
  //   return <p>Loading...</p>;
  // }

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
        {/* {studentList == null ? ( */}
        <Card className="max-w-sm ml-2 p-4 max-h-96 overflow-y-scroll sticky top-4">
          {lessonCycleFocus !== null
            ? lessonCycleFocus.courseDescription
            : 'No course selected'}
        </Card>
        {/* ) : (
          <Card className="max-w-sm ml-2 p-4 max-h-96 overflow-y-scroll sticky top-4">
            <Title>{carouselSubjectFocus}</Title>
            <div className="pb-4">
              {studentList.map((student) => (
                <div
                  tabIndex={student.id}
                  className="gap-0 collapse bg-base-200 py-0 px-2 m-0.5"
                >
                  <div className="collapse-title font-medium text-sm m-0 gap-0 py-2 min-h-0">
                    {student.name}
                  </div>
                  <div className="collapse-content m-0 text-sm py-0 min-h-0">
                    Some other subjects
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )} */}
      </div>
    </main>
  );
}
