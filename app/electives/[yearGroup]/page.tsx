import ElectiveTable from '../elective-table';
import { Card } from '@tremor/react';
import { Student as StudentDTO } from '../../tables/student-table';
import { ElectiveDTO } from '../elective-card';
import ElectiveSubscriberAccordion, {
  ElectivePreference as ElectivePreferenceDTO
} from '../elective-subscriber-accordion';
import { fetchElectiveYearGroupWithAllStudents } from '../../api/request-elective-preferences';
import {
  reconstructTableWithDimensions,
  TableCellData
} from '../../utils/tables';

// Slug[0] = Year Group

const dynamic = 'force-dynamic';

interface Props {
  params: { yearGroup: string };
  searchParams: {
    courseId: string;
    carouselId: string;
    partyId: string;
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
    courseId: courseIdString,
    carouselId: carouselIdString,
    partyId: partyIdString
  }
}: Props) {
  // const yearGroupAsNumber: number | null = yearGroup;
  const courseId = parseInt(courseIdString);
  const carouselId = parseInt(carouselIdString);
  const partyId = parseInt(partyIdString);

  const yearGroupAsNumber = parseInt(yearGroup);

  const yearGroupElectiveData: YearGroupElectives =
    await fetchElectiveYearGroupWithAllStudents(yearGroupAsNumber);
  if (yearGroupElectiveData !== null) {
    const {
      yearGroupRankInt,
      carouselRows,
      carouselColumns: carouselCols,
      studentDTOList: studentList,
      electiveDTOList: electiveData,
      electivePreferenceDTOList: electivePreferences
    } = yearGroupElectiveData;

    console.log('Type of ygElectiveD:', yearGroupElectiveData);

    // Initialize with empty arrays or nulls
    let tableCellsData: TableCellData[] = [];
    let electiveTableData: ElectiveDTO[][] = [];
    let lessonCycleFocus: ElectiveDTO | null = null;
    let filteredStudentList: StudentDTO[] = [];
    let filteredIDList: number[] = [];
    let studentElectiveList: ElectivePreferenceDTO[] = [];

    try {
      // Safely map electiveData
      tableCellsData =
        electiveData?.map((elective) => ({
          row: elective.courseId,
          col: elective.carouselId,
          value: elective
        })) ?? [];

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

      // Safely filter electivePreferences
      studentElectiveList =
        electivePreferences?.filter((preferenceList) =>
          filteredIDList.includes(preferenceList.partyId)
        ) ?? [];
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Caught an Error:', error.message);
      } else {
        console.error('Something went wrong:', error);
      }

      return <>Error caught.</>;
    }

    return (
      <>
        <div className="flex w-full items-top justify-between pt-4">
          <Card className="flex-shrink-0 flex-grow max-w-4xl min-h-72">
            <ElectiveTable
              electives={electiveTableData}
              partyId={partyId}
            ></ElectiveTable>
          </Card>
          {lessonCycleFocus !== null &&
          studentList !== null &&
          studentElectiveList !== null ? (
            <Card className="max-w-sm ml-2 px-2 py-0 max-h-screen overflow-y-scroll sticky top-4">
              <ElectiveSubscriberAccordion
                lessonCycleFocus={lessonCycleFocus}
                studentFocus={partyId}
                studentList={filteredStudentList}
                electivePreferenceList={studentElectiveList}
              />
            </Card>
          ) : (
            <Card className="max-w-sm ml-2 px-2 max-h-96 overflow-y-scroll sticky top-4">
              No course selected
            </Card>
          )}
        </div>
      </>
    );
  } else
    return (
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
    );
}
