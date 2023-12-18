import { revalidateTag } from 'next/cache';

import { ElectiveState } from '../elective-reducers';
import { ElectivePreferenceDTO } from '../../api/dto-interfaces';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchElectiveYearGroupWithAllStudents = async (
  yearGroup: number
) => {
  const tag = 'electives';

  const fetchURL = `${apiBaseUrl}/electives-yeargroup-with-all-students/${yearGroup}`;

  try {
    const response = await fetch(fetchURL, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
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

    return await response.json();
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

  const requestBody = {
    forwardingUrl: fetchURL,
    forwardingBody: ePrefList
  };

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
      body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return null;
    }

    return response;

    // revalidatePath("/electives/") // Update cached posts
    // redirect(redirectUrl) // Navigate to new route
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};
