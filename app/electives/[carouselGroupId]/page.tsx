import { Text, Title } from '@tremor/react';
import { compileElectiveAvailability } from '../checkElectiveAssignments';

import FilteredStudentsCard from '../filtered-students-card';
import ElectiveContextProvider from '../elective-context-provider';
import ToolTipsToggle from '../../generic/components/tooltips/tool-tips-toggle';
import { Suspense } from 'react';

import { ElectiveFilters } from '../elective-filters';
import ElectiveFilterContextProvider from '../elective-filter-context-provider';
import { CellDataAndMetaData, TabularDTO } from '../../api/dto-interfaces';

import ElectiveCard from '../elective-card';
import { ElectiveAvailability } from '../../api/state-types';
import { RotateCarouselButton } from './rotate-carousel-button';
import { ElectiveDTO } from '../../api/dtos/ElectiveDTOSchema';
import BigTableCard from '../../generic/components/tables/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../generic/components/tables/dynamic-dimension-timetable';
import { fetchCarouselGroupWithAllStudents } from '../../api/actions/custom/fetch-carousel-group-with-all-students';
import { isNotUndefined } from '../../api/main';

interface Props {
  params: { carouselGroupId: string };
  searchParams: {
    cacheSetting: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ElectivesPage({
  params: { carouselGroupId }
}: Props) {
  const { data: yearGroupElectiveData } =
    await fetchCarouselGroupWithAllStudents(carouselGroupId);

  // Initialize with empty arrays or nulls
  let tableCellsData: CellDataAndMetaData<ElectiveDTO>[] = [];
  let electiveAvailability: ElectiveAvailability = {};
  let optionBlocksTabularDTO: TabularDTO<ElectiveDTO, ElectiveDTO>;

  if (isNotUndefined(yearGroupElectiveData)) {
    const {
      carouselRows,
      carouselColumns: carouselCols,
      studentDTOList,
      electiveDTOList,
      electivePreferenceDTOList: electivePreferences
    } = yearGroupElectiveData;

    console.log(studentDTOList);
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

    if (!yearGroupElectiveData) {
      return <BigTableCard>No elective data found.</BigTableCard>;
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
          </div>
          <ElectiveFilters electiveDTOList={electiveDTOList}></ElectiveFilters>
          <div className="flex w-full items-top justify-between pt-4">
            <Suspense>
              <div className="flex w-full items-top justify-between pt-4 select-none">
                <BigTableCard>
                  <div className="p-0 flex justify-center pb-2">
                    <Title>{yearGroupElectiveData.name}</Title>
                  </div>
                  <div className="flex justify-center gap-2">
                    <RotateCarouselButton direction="LEFT"></RotateCarouselButton>
                    <RotateCarouselButton direction="RIGHT"></RotateCarouselButton>
                  </div>
                  <DynamicDimensionTimetable
                    tableContents={optionBlocksTabularDTO}
                    headerTransformer={OptionBlockHeader}
                    cellDataTransformer={ElectiveCard}
                  />
                </BigTableCard>

                <FilteredStudentsCard></FilteredStudentsCard>
              </div>
            </Suspense>
          </div>
        </ElectiveFilterContextProvider>
      </ElectiveContextProvider>
    );
  } else return <>Error</>;
}

const OptionBlockHeader: HeaderTransformer<ElectiveDTO> = ({ data }) => {
  return (
    <div className="text-sm p-2 font-medium">
      Option Block {data.carouselOrdinal}
    </div>
  );
};
