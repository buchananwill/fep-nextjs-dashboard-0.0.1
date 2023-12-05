import { revalidatePath, revalidateTag } from 'next/cache';

import { ElectiveState } from '../electives/elective-reducers';
import { redirect } from 'next/navigation';
import { ElectivePreferenceDTO } from './dto-interfaces';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchElectiveYearGroupWithAllStudents = async (
  yearGroup: number,
  cacheSetting: RequestCache
) => {
  const tag = 'electives';

  if (cacheSetting == 'reload') revalidateTag(tag);

  const fetchURL = `${apiBaseUrl}/electives-yeargroup-with-all-students/${yearGroup}`;

  try {
    const response = await fetch(fetchURL, {
      next: { revalidate: 300, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const updateElectiveAssignments = async ({
  electivePreferences,
  modifiedPreferences
}: ElectiveState) => {
  const tag = 'electiveAssignments';

  const fetchURL = `option-block-assignments`;

  console.log('Inside first function: ', fetchURL);

  const ePrefList: ElectivePreferenceDTO[] = [];

  for (let value of electivePreferences.keys()) {
    const modificationSet = modifiedPreferences.get(value);
    const nextPreferences = electivePreferences.get(value);
    if (modificationSet && modificationSet.size > 0 && nextPreferences) {
      modificationSet.forEach((modifiedPreferencePosition) =>
        ePrefList.push(nextPreferences[modifiedPreferencePosition])
      );
    }
  }

  console.log('body in first function: ', ePrefList);

  try {
    const response = await fetch(fetchURL, {
      next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(ePrefList) // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    // revalidatePath("/electives/") // Update cached posts
    // redirect(redirectUrl) // Navigate to new route

    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

function mapToArray<V>(map: Map<number, V>) {
  return Array.from(map.entries());
}
