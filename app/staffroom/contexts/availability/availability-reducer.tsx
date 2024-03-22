import { AvailabilityContextInterface } from './availability-context';
import { produce } from 'immer';
import { interval } from 'date-fns/interval';
import { areIntervalsOverlapping } from 'date-fns/fp';
import { WritableDraft } from 'immer/src/types/types-external';
import { ProviderAvailability } from '../../../api/dto-interfaces';

export interface ToggleAvailability {
  type: 'toggleAvailability';
  mechanic: number;
  start: Date;
  end: Date;
  targetOutcome: number;
}

export interface SetAvailabilityData {
  type: 'setAvailabilityData';
  data: AvailabilityContextInterface;
}

export interface ClearUnsavedAvailability {
  type: 'clearUnsavedAvailability';
}

export interface UpdateMechanicAvailabilities {
  type: 'updateMechanicAvailabilities';
  data: ProviderAvailability[];
}

export interface SetDndKey {
  type: 'setDndKey';
  key: string;
  data: ProviderAvailability;
}

export type AvailabilityAction =
  | ToggleAvailability
  | SetAvailabilityData
  | UpdateMechanicAvailabilities
  | ClearUnsavedAvailability
  | SetDndKey;

export default function availabilityReducer(
  state: AvailabilityContextInterface,
  action: AvailabilityAction
): AvailabilityContextInterface {
  switch (action.type) {
    case 'toggleAvailability': {
      return produce(state, (draft) => {
        const { mechanicAvailability: mechanicAvailabilities } = draft;
        const { mechanic, start, end, targetOutcome } = action;
        const mechanicAvailabilityList = mechanicAvailabilities.get(mechanic);
        let modified = false;
        if (mechanicAvailabilityList) {
          const dateNormalizedInterval = interval(start, end);
          const overlapCheck = areIntervalsOverlapping(dateNormalizedInterval);
          const availabilityOverlapCheck = (
            nextAvail: WritableDraft<ProviderAvailability>
          ): boolean => {
            const {
              cycleSubspan: { timespan }
            } = nextAvail;
            return overlapCheck(timespan);
          };

          const filtered = mechanicAvailabilityList.filter(
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
