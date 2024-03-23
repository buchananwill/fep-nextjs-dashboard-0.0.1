import { TabularDTO } from '../dto-interfaces';
import { PeriodDTO } from '../dtos/PeriodDTOSchema';
import { API_ACADEMIC_URL, API_BASE_URL } from '../main';
import { getWithoutBody } from './template-actions';
import { ActionResponsePromise } from './actionResponse';
import { CycleSubspanDto } from '../dtos/CycleSubspanDtoSchema';
import { CycleDto } from '../dtos/CycleDtoSchema';

export const fetchAllPeriodsInCycle = async (): ActionResponsePromise<
  TabularDTO<string, PeriodDTO>
> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-all-periods-in-cycle`;

  return getWithoutBody(fetchURL);
};

export async function getFormattedPeriodsInCycle() {
  const allPeriodsInCycleResponse = await fetchAllPeriodsInCycle();

  const allPeriodsInCycle = allPeriodsInCycleResponse.data;

  if (allPeriodsInCycle === undefined) {
    const emptyDto: TabularDTO<string, PeriodDTO> = {
      headerData: [],
      cellDataAndMetaData: [],
      numberOfColumns: 0,
      numberOfRows: 0
    };
    return emptyDto;
  }

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );
  return allPeriodsInCycle;
}

export function getCycleModel() {
  const url = `${API_BASE_URL}/cycleModel/1`;
  return getWithoutBody<CycleDto>(url);
}
