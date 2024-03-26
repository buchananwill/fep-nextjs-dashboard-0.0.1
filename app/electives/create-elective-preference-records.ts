import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';

export function createElectivePreferenceRecords(
  electivePreferenceList: ElectivePreferenceDTO[]
) {
  return electivePreferenceList.reduce<Map<number, ElectivePreferenceDTO[]>>(
    (acc, curr) => {
      if (acc.get(curr.userRoleId)) {
        acc.get(curr.userRoleId)?.push(curr);
      } else {
        acc.set(curr.userRoleId, [curr]);
      }
      return acc;
    },
    new Map()
  );
}