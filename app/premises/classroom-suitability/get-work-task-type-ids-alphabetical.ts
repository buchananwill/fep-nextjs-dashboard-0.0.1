import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { parseTen } from '../../api/date-and-time';

export function getWorkTaskTypeIdsAlphabetical(
  wttStringMap: StringMap<WorkTaskTypeDto>
) {
  return Object.keys(wttStringMap)
    .sort((key1, key2) => {
      return wttStringMap[key1].name.localeCompare(wttStringMap[key2].name);
    })
    .map(parseTen);
}