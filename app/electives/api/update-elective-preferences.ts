import { ElectiveState } from '../elective-reducers';
import { ElectivePreferenceDTO } from '../../api/dtos/ElectivePreferenceDTOSchema';
import { putOptionBlockAssignments } from '../../api/actions/custom/option-block-assignments';
import { isNotUndefined } from '../../api/main';

export const updateElectiveAssignments = async ({
  electivePreferences,
  modifiedPreferences
}: ElectiveState) => {
  const ePrefList: ElectivePreferenceDTO[] = [];

  for (let value of electivePreferences.keys()) {
    const modificationSet = modifiedPreferences.get(value);
    const nextPreferences = electivePreferences.get(value);
    if (modificationSet && modificationSet.size > 0 && nextPreferences) {
      modificationSet.forEach(
        (modifiedPreferencePosition) =>
          ePrefList.push(nextPreferences[modifiedPreferencePosition - 1]) // preferencePosition is one-indexed
      );
    }
  }

  const { data } = await putOptionBlockAssignments(ePrefList);

  return isNotUndefined(data) ? data : [];
};
