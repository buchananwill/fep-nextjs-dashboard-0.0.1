import {
  CycleSubspan,
  CycleSubspanDto,
  ProviderAvailability,
  ProviderAvailabilityDto
} from '../../../api/dto-interfaces';
import { createContext, Dispatch, SetStateAction } from 'react';

import { AvailabilityAction, ToggleAvailability } from './availability-reducer';

export interface AvailabilityContextInterface {
  mechanicAvailability: Map<number, ProviderAvailability[]>;
  workshopAvailability: CycleSubspan[];
  unsavedChanges: boolean;
  dndMap: { [key: string]: ProviderAvailability };
}

export interface AvailabilityDispatch {
  dispatch: Dispatch<AvailabilityAction>;
}

export const AvailabilityContext = createContext<AvailabilityContextInterface>({
  mechanicAvailability: new Map(),
  workshopAvailability: [],
  unsavedChanges: false,
  dndMap: {}
});

export const AvailabilityDispatchContext = createContext<AvailabilityDispatch>({
  dispatch: ({}) => {}
});
