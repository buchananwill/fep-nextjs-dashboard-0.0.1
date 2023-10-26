import { ElectivePreference } from './elective-subscriber-accordion';

interface ChangedCarousel {
  type: 'changed';
  studentId: number;
  preferencePosition: number;
  carouselNumber: number;
}

interface SetActive {
  type: 'setActive';
  studentId: number;
  preferencePosition: number;
}

type Actions = ChangedCarousel | SetActive;

export type ElectivesState = Record<number, ElectivePreference[]>;

export default function electivePreferencesReducer(
  electivePreferences: ElectivesState,
  action: Actions
) {
  switch (action.type) {
    case 'changed': {
      const { studentId, preferencePosition, carouselNumber } = action;
      const preferenceToUpdate =
        electivePreferences[studentId][preferencePosition];

      const updatedPreference: ElectivePreference = { ...preferenceToUpdate };
      updatedPreference.assignedCarousel = carouselNumber;

      const updatedState: Record<number, ElectivePreference[]> = {};

      for (const [key, preferenceList] of Object.entries(electivePreferences)) {
        const numericKey = parseInt(key);
        if (numericKey !== studentId) {
          updatedState[numericKey] = preferenceList;
        } else {
          updatedState[numericKey] = preferenceList.map(
            (preference, preferenceIndex) =>
              preferenceIndex === preferencePosition
                ? updatedPreference
                : preference
          );
        }
      }
      return updatedState;
    }
    case 'setActive': {
      const { studentId, preferencePosition } = action;
      const updatedStudent = electivePreferences[studentId];
      const updatedPreference = { ...updatedStudent[preferencePosition] };
      updatedPreference.isActive = !updatedPreference.isActive;

      const updatedState: Record<number, ElectivePreference[]> = {};

      for (const [key, preferenceList] of Object.entries(electivePreferences)) {
        const numericKey = parseInt(key);
        if (numericKey !== studentId) {
          updatedState[numericKey] = preferenceList;
        } else {
          updatedState[numericKey] = preferenceList.map(
            (preference, preferenceIndex) =>
              preferenceIndex === preferencePosition
                ? updatedPreference
                : preference
          );
        }
      }
      return updatedState;
    }

    default: {
      throw Error('Unkown action: ' + action);
    }
  }
}

export function createdElectivePreferenceRecords(
  electivePreferenceList: ElectivePreference[]
) {
  const groupedByPartyId = electivePreferenceList.reduce<
    Record<number, ElectivePreference[]>
  >((acc, curr) => {
    if (!acc[curr.partyId]) {
      acc[curr.partyId] = [];
    }
    // This will get removed once the preferences arrive with their active state from the database.
    if (curr.assignedCarousel < 0) curr.isActive = false;
    else curr.isActive = true;

    acc[curr.partyId].push(curr);
    return acc;
  }, {});

  return groupedByPartyId;
}
