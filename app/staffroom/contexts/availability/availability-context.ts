'use client';
import { createContext, Dispatch, SetStateAction } from 'react';

import { AvailabilityAction, ToggleAvailability } from './availability-reducer';
import { ProviderAvailabilityDto } from '../../../api/dtos/ProviderAvailabilityDtoSchema';
import { CycleSubspanDto } from '../../../api/dtos/CycleSubspanDtoSchema';
import { CycleDto } from '../../../api/dtos/CycleDtoSchema';
import { DayOfWeekArray } from '../../../api/date-and-time';

export interface AvailabilityContextInterface {
  providerAvailability: Map<number, ProviderAvailabilityDto[]>;
  cycleAvailabilityUnits: CycleSubspanDto[];
  cycleModel: CycleDto;
  unsavedChanges: boolean;
  dndMap: { [key: string]: ProviderAvailabilityDto };
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
