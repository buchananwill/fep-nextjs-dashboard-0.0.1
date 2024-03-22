import { AvailabilityContextInterface } from './availability-context';
import { produce } from 'immer';
import { interval } from 'date-fns/interval';
import { areIntervalsOverlapping } from 'date-fns/fp';
import { WritableDraft } from 'immer/src/types/types-external';
import { ProviderAvailabilityDto } from '../../../api/dtos/ProviderAvailabilityDtoSchema';
import { getStartAndEndDatesAsEpochal } from './get-start-and-end-dates-as-epochal';

export interface ToggleAvailability {
  type: 'toggleAvailability';
  providerId: number;
  start: number;
  end: number;
  targetOutcome: number;
}

export interface SetAvailabilityData {
  type: 'setAvailabilityData';
  data: AvailabilityContextInterface;
}

export interface ClearUnsavedAvailability {
  type: 'clearUnsavedAvailability';
}

export interface UpdateProviderAvailabilities {
  type: 'updateMechanicAvailabilities';
  data: ProviderAvailabilityDto[];
}

export interface SetDndKey {
  type: 'setDndKey';
  key: string;
  data: ProviderAvailabilityDto;
}

export type AvailabilityAction =
  | ToggleAvailability
  | SetAvailabilityData
  | UpdateProviderAvailabilities
  | ClearUnsavedAvailability
  | SetDndKey;

export default function availabilityReducer(
  state: AvailabilityContextInterface,
  action: AvailabilityAction
): AvailabilityContextInterface {
  switch (action.type) {
    case 'toggleAvailability': {
      return produce(state, (draft) => {
        const { providerAvailability: availabilityMap } = draft;
        const { providerId, start, end, targetOutcome } = action;
        const providerAvailabilityList = availabilityMap.get(providerId);
        let modified = false;
        if (providerAvailabilityList) {
          const dateNormalizedInterval = interval(start, end);
          const overlapCheck = areIntervalsOverlapping(dateNormalizedInterval);
          const availabilityOverlapCheck = (
            nextAvail: WritableDraft<ProviderAvailabilityDto>
          ): boolean => {
            const { startDate, endDate } =
              getStartAndEndDatesAsEpochal(nextAvail);
            const timespan = interval(startDate, endDate);
            return overlapCheck(timespan);
          };

          const filtered = providerAvailabilityList.filter(
            availabilityOverlapCheck
          );
          if (filtered.length > 0) {
            for (let filteredElement of filtered) {
              if (filteredElement.availabilityCode != targetOutcome) {
                modified = modified || true;
                filteredElement.availabilityCode = targetOutcome;
              }
            }
          }
        }
        draft.unsavedChanges = modified;
      });
    }
    case 'setAvailabilityData': {
      return action.data;
    }
    case 'updateMechanicAvailabilities': {
      return produce(state, (draft) => {
        console.log('Not implemented yet.');
      });
    }
    case 'clearUnsavedAvailability': {
      return produce(state, (draft) => {
        draft.unsavedChanges = false;
      });
    }
    case 'setDndKey': {
      const { key, data } = action;
      return produce(state, (draft) => {
        draft.dndMap[key] = data;
      });
    }
    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}
