import OptionBlockTable from '../elective-table';
import { Card, Text, Title } from '@tremor/react';
import { Student as StudentDTO } from '../../tables/student-table';
import { ElectiveDTO } from '../elective-card';
import {
  ElectiveAvailability,
  ElectivePreference as ElectivePreferenceDTO
} from '../elective-subscriber-accordion';
import { fetchElectiveYearGroupWithAllStudents } from '../../api/request-elective-preferences';
import {
  reconstructTableWithDimensions,
  TableCellData
} from '../../utils/tables';
import { compileElectiveAvailability } from '../checkElectiveAssignments';

import { RefreshButton } from '../../components/refresh-button';
import SubjectFocusCard from '../subject-focus-card';
import ElectivesContextProvider from '../elective-context-provider';
import CommitChanges from '../commit-changes';
import ToolTipsToggle from '../tool-tips-toggle';
import { Suspense } from 'react';

interface Props {
  params: { yearGroup: string };
  searchParams: {
    courseCarouselId: string;
    carouselId: string;
    partyId: string;
    cacheSetting: string;
  };
}

interface YearGroupElectives {
  yearGroupRankInt: number;
  carouselRows: number;
  carouselColumns: number;
  studentDTOList: StudentDTO[];
  electiveDTOList: ElectiveDTO[];
  electivePreferenceDTOList: ElectivePreferenceDTO[];
}

const versionInView = 'stored';

export default async function ElectivesPage({
  params: { yearGroup },
  searchParams: {
    courseCarouselId: courseIdString,
    carouselId: carouselIdString,
    partyId: partyIdString,
    cacheSetting
  }
}: Props) {
  // const yearGroupAsNumber: number | null = yearGroup;
  const courseId = parseInt(courseIdString);
  const carouselId = parseInt(carouselIdString);
  const partyId = parseInt(partyIdString);
  const yearGroupAsNumber = parseInt(yearGroup);

  let requestCacheValue: RequestCache;
  if (cacheSetting === 'reload') {
    requestCacheValue = 'reload';
  } else if (cacheSetting === 'noCache') {
    requestCacheValue = 'no-cache';
  } else {
    requestCacheValue = 'default';
  }

  const yearGroupElectiveData: YearGroupElectives =
    await fetchElectiveYearGroupWithAllStudents(
      yearGroupAsNumber,
      requestCacheValue
    );

  // Initialize with empty arrays or nulls
  let tableCellsData: TableCellData[] = [];
  let electiveTableData: ElectiveDTO[][] = [];
  let lessonCycleFocus: ElectiveDTO | null = null;
  let filteredStudentList: StudentDTO[] = [];
  let filteredIDList: number[] = [];
  let electiveAvailability: ElectiveAvailability = {};

  if (yearGroupElectiveData !== null) {
    const {
      yearGroupRankInt,
      carouselRows,
      carouselColumns: carouselCols,
      studentDTOList: studentList,
      electiveDTOList: electiveData,
      electivePreferenceDTOList: electivePreferences
    } = yearGroupElectiveData;

    try {
      // Safely map electiveData
      tableCellsData =
        electiveData?.map((elective) => ({
          row: elective.courseCarouselId,
          col: elective.carouselId,
          value: elective
        })) ?? [];

      // Safely map electiveAvailability
      electiveAvailability = compileElectiveAvailability(electiveData);

      // Only call reconstructTableWithDimensions if tableCellsData is not empty
      if (tableCellsData.length > 0) {
        electiveTableData = reconstructTableWithDimensions(
          tableCellsData,
          carouselRows,
          carouselCols
        );
      }

      // Safely get lessonCycleFocus
      lessonCycleFocus = electiveTableData?.[courseId]?.[carouselId] ?? null;

      // Safely filter studentList
      if (lessonCycleFocus !== null) {
        const localCopy = lessonCycleFocus;
        filteredStudentList =
          studentList?.filter((student) =>
            localCopy.subscriberPartyIDs.includes(student.id)
          ) ?? [];
      }

      // Safely map filteredStudentList to filteredIDList
      filteredIDList = filteredStudentList?.map((student) => student.id) ?? [];
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Caught an Error:', error.message);
      } else {
        console.error('Something went wrong:', error);
      }

      return <>Error caught.</>;
    }

    return (
      <ElectivesContextProvider electivePreferenceList={electivePreferences}>
        <div className="flex w-full items-baseline grow-0">
          <Title>Option Blocks</Title>
          <Text className="mx-2">Subscription Analysis</Text>
          <span className="grow"></span>
          <CommitChanges>Commit Changes</CommitChanges>
          <ToolTipsToggle></ToolTipsToggle>
          <RefreshButton />
        </div>
        <div className="flex w-full items-top justify-between pt-4">
          <Suspense>
            {yearGroupElectiveData !== null ? (
              <div className="flex w-full items-top justify-between pt-4  select-none">
                <Card className="flex-shrink-0 flex-grow max-w-4xl min-h-72">
                  <OptionBlockTable
                    electives={electiveTableData}
                    partyId={partyId}
                  ></OptionBlockTable>
                </Card>

                <SubjectFocusCard
                  lessonCycleFocus={lessonCycleFocus}
                  studentFocus={partyId}
                  filteredStudentList={filteredStudentList}
                  electivePreferences={electivePreferences}
                  electiveAvailability={electiveAvailability}
                ></SubjectFocusCard>
              </div>
            ) : (
              <>
                {' '}
                <div className="flex w-full items-top justify-between pt-4">
                  <Card className="flex-shrink-0 flex-grow max-w-4xl min-h-72">
                    Unable to find requested table.
                  </Card>

                  <Card className="max-w-sm ml-2 p-4 max-h-96 overflow-y-scroll sticky top-4">
                    No yeargroup loaded.
                  </Card>
                </div>
              </>
            )}
          </Suspense>
        </div>
      </ElectivesContextProvider>
    );
  } else return <>Error</>;
}
