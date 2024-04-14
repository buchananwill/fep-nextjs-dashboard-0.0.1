'use client';
import { createContext, Dispatch } from 'react';

import { AvailabilityAction } from './availability-reducer';
import { ProviderAvailabilityDto } from '../../../api/dtos/ProviderAvailabilityDtoSchema';
import { CycleSubspanDto } from '../../../api/dtos/CycleSubspanDtoSchema';
import { CycleDto } from '../../../api/dtos/CycleDtoSchema';
import { DayOfWeekArray } from '../../../api/date-and-time';
import { ProviderRoleAvailabilityDto } from '../../../api/dtos/ProviderRoleAvailabilityDtoSchema';

export interface AvailabilityContextInterface {
  providerAvailability: Map<number, ProviderRoleAvailabilityDto[]>;
  cycleAvailabilityUnits: CycleSubspanDto[];
  cycleModel: CycleDto;
  unsavedChanges: boolean;
  dndMap: { [key: string]: ProviderRoleAvailabilityDto };
}

export interface AvailabilityDispatch {
  dispatch: Dispatch<AvailabilityAction>;
}

export const CycleModelMock = {
  cycleSubspans: [],
  cycleDayZero: DayOfWeekArray[0],
  cycleLengthInDays: 7,
  id: NaN
};
export const AvailabilityContext = createContext<AvailabilityContextInterface>({
  providerAvailability: new Map(),
  cycleAvailabilityUnits: [],
  unsavedChanges: false,
  dndMap: {},
  cycleModel: CycleModelMock
});

export const AvailabilityDispatchContext = createContext<AvailabilityDispatch>({
  dispatch: ({}) => {}
});
