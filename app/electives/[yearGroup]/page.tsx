import OptionBlockTable from '../elective-table';
import { Card, Text, Title } from '@tremor/react';
import { ElectiveAvailability } from '../elective-subscriber-disclosure-group';
import { fetchElectiveYearGroupWithAllStudents } from '../../api/request-elective-preferences';
import {
  reconstructTableWithDimensions,
  TableCellData
} from '../../utils/tables';
import { compileElectiveAvailability } from '../checkElectiveAssignments';

import { RefreshDropdown } from '../../components/refresh-dropdown';
import FilteredStudentsCard from '../filtered-students-card';
import ElectiveContextProvider from '../elective-context-provider';
import ToolTipsToggle from '../tool-tips-toggle';
import { Suspense } from 'react';

import { ElectiveFilters } from '../elective-filters';
import ElectiveFilterContextProvider from '../elective-filter-context-provider';
import { ElectiveDTO, YearGroupElectives } from '../../api/dto-interfaces';

interface Props {
  params: { yearGroup: string };
  searchParams: {
    cacheSetting: string;
  };
}

export default async function ElectivesPage({
  params: { yearGroup },
  searchParams: { cacheSetting }
}: Props) {
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
  let electiveAvailability: ElectiveAvailability = {};

  if (yearGroupElectiveData !== null) {
    const {
      yearGroupRankInt,
      carouselRows,
      carouselColumns: carouselCols,
      studentDTOList,
      electiveDTOList,
      electivePreferenceDTOList: electivePreferences
    } = yearGroupElectiveData;

    try {
      // Safely map electiveData
      tableCellsData =
        electiveDTOList?.map((elective) => ({
          row: elective.courseCarouselId,
          col: elective.carouselId,
          value: elective
        })) ?? [];

      // Safely map electiveAvailability
      electiveAvailability = compileElectiveAvailability(electiveDTOList);

      // Only call reconstructTableWithDimensions if tableCellsData is not empty
      if (tableCellsData.length > 0) {
        electiveTableData = reconstructTableWithDimensions(
          tableCellsData,
          carouselRows,
          carouselCols
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Caught an Error:', error.message);
      } else {
        console.error('Something went wrong:', error);
      }

      return <>Error caught.</>;
    }

    return (
      <ElectiveContextProvider
        electivePreferenceList={electivePreferences}
        studentList={studentDTOList}
      >
        <ElectiveFilterContextProvider>
          <div className="flex w-full items-baseline grow-0 mb-2">
            <Title>Option Blocks</Title>
            <Text className="mx-2">Subscription Analysis</Text>
            <span className="grow"></span>

            <ToolTipsToggle></ToolTipsToggle>
            <RefreshDropdown />
          </div>
          <ElectiveFilters electiveDTOList={electiveDTOList}></ElectiveFilters>
          <div className="flex w-full items-top justify-between pt-4">
            <Suspense>
              {yearGroupElectiveData ? (
                <div className="flex w-full items-top justify-between pt-4  select-none">
                  <Card className="flex-shrink-0 flex-grow max-w-5xl max-h-min h-min overflow-x-auto p-2">
                    <div className="m-2 p-2 min-w-max max-h-min">
                      <OptionBlockTable
                        electives={electiveTableData}
                      ></OptionBlockTable>
                    </div>
                  </Card>

                  <FilteredStudentsCard
                    electiveAvailability={electiveAvailability}
                  ></FilteredStudentsCard>
                </div>
              ) : (
                <>
                  {' '}
                  <div className="flex w-full items-top justify-between pt-4">
                    <Card className="flex-shrink-0 flex-grow max-w-4xl max-h-[70vh]">
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
        </ElectiveFilterContextProvider>
      </ElectiveContextProvider>
    );
  } else return <>Error</>;
}
