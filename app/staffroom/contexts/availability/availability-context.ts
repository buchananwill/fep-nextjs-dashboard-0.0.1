import { createContext, Dispatch, SetStateAction } from 'react';

import { AvailabilityAction, ToggleAvailability } from './availability-reducer';
import { ProviderAvailabilityDto } from '../../../api/dtos/ProviderAvailabilityDtoSchema';
import { CycleSubspanDto } from '../../../api/dtos/CycleSubspanDtoSchema';

export interface AvailabilityContextInterface {
  providerAvailability: Map<number, ProviderAvailabilityDto[]>;
  cycleAvailabilityUnits: CycleSubspanDto[];
  unsavedChanges: boolean;
  dndMap: { [key: string]: ProviderAvailabilityDto };
}

export interface AvailabilityDispatch {
  dispatch: Dispatch<AvailabilityAction>;
}

export const AvailabilityContext = createContext<AvailabilityContextInterface>({
  providerAvailability: new Map(),
  cycleAvailabilityUnits: [],
  unsavedChanges: false,
  dndMap: {}
});

export const AvailabilityDispatchContext = createContext<AvailabilityDispatch>({
  dispatch: ({}) => {}
});
