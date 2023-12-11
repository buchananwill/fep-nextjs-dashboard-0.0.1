import { Card, Text, Title } from '@tremor/react';
import { fetchElectiveYearGroupWithAllStudents } from '../../api/request-elective-preferences';
import { compileElectiveAvailability } from '../checkElectiveAssignments';

import { RefreshDropdown } from '../../components/refresh-dropdown';
import FilteredStudentsCard from '../filtered-students-card';
import ElectiveContextProvider from '../elective-context-provider';
import ToolTipsToggle from '../../components/tooltips/tool-tips-toggle';
import { Suspense } from 'react';

import { ElectiveFilters } from '../elective-filters';
import ElectiveFilterContextProvider from '../elective-filter-context-provider';
import {
  CellDataAndMetaData,
  ElectiveDTO,
  TabularDTO,
  YearGroupElectives
} from '../../api/dto-interfaces';
import BigTableCard from '../../components/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../components/dynamic-dimension-timetable';
import ElectiveCard from '../elective-card';
import { ElectiveAvailability } from '../../api/state-types';

interface Props {
  params: { yearGroup: string };
  searchParams: {
    cacheSetting: string;
  };
}

export const dynamic = 'force-dynamic';

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
  let tableCellsData: CellDataAndMetaData<ElectiveDTO>[] = [];
  let electiveAvailability: ElectiveAvailability = {};
  let optionBlocksTabularDTO: TabularDTO<ElectiveDTO, ElectiveDTO>;

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
          cellRow: elective.electiveOrdinal,
          cellColumn: elective.carouselOrdinal - 1, // carousel ordinal is one-indexed
          cellData: elective
        })) ?? [];

      const headerCells: ElectiveDTO[] = [];

      const distinctCarousels: number[] = [];

      for (let electiveDTO of electiveDTOList) {
        if (!distinctCarousels.includes(electiveDTO.carouselOrdinal)) {
          headerCells.push(electiveDTO);
          distinctCarousels.push(electiveDTO.carouselOrdinal);
        }
      }

      const sortedDistinctCarousels = headerCells.sort(
        (a, b) => a.carouselOrdinal - b.carouselOrdinal
      );

      // Safely map electiveAvailability
      electiveAvailability = compileElectiveAvailability(electiveDTOList);

      optionBlocksTabularDTO = {
        numberOfRows: carouselRows,
        numberOfColumns: carouselCols,
        headerData: sortedDistinctCarousels,
        cellDataAndMetaData: tableCellsData
      };
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
        electiveDtoList={electiveDTOList}
        electiveAvailability={electiveAvailability}
      >
        <ElectiveFilterContextProvider>
          <div className="flex w-full items-baseline grow-0 mb-2">
            <Title>Option Blocks</Title>
            <Text className="mx-2">Enrollment Analysis</Text>
            <span className="grow"></span>

            <ToolTipsToggle></ToolTipsToggle>
            <RefreshDropdown />
          </div>
          <ElectiveFilters electiveDTOList={electiveDTOList}></ElectiveFilters>
          <div className="flex w-full items-top justify-between pt-4">
            <Suspense>
              {yearGroupElectiveData ? (
                <div className="flex w-full items-top justify-between pt-4  select-none">
                  <BigTableCard>
                    <DynamicDimensionTimetable
                      tableContents={optionBlocksTabularDTO}
                      headerTransformer={OptionBlockHeader}
                      cellDataTransformer={ElectiveCard}
                    />
                  </BigTableCard>

                  <FilteredStudentsCard></FilteredStudentsCard>
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

const OptionBlockHeader: HeaderTransformer<ElectiveDTO> = ({ data }) => {
  return <>Option Block {data.carouselOrdinal} </>;
};
