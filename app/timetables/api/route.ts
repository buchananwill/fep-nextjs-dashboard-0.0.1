import axios from 'axios';
import {
  BuildMetricDTO,
  LessonCycleDTO,
  Period,
  TabularDTO
} from '../../api/dto-interfaces';
import { NextRequest } from 'next/server';

interface SearchParams {
  id: number;
  // token: string
}

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchSchedule = async (searchId: number) => {
  try {
    if (Number.isNaN(searchId)) return null;

    const response = await axios.get(`${apiBaseUrl}/schedules`, {
      params: { id: searchId }
      // headers: {
      //     'Authorization': `Bearer ${searchParams.token}`
      // }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const fetchAllPeriodsInCycle = async (): Promise<
  TabularDTO<string, Period>
> => {
  const fetchURL = `${apiBaseUrl}/get-all-periods-in-cycle`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
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

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return {
      numberOfColumns: 0,
      numberOfRows: 0,
      cellDataAndMetaData: [],
      headerData: []
    };
  }
};

export const fetchScheduleIds = async (): Promise<number[]> => {
  const fetchURL = `${apiBaseUrl}/get-list-of-schedule-ids`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-store', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};

export const fetchAllLessonCycles = async (
  scheduleId: number
): Promise<LessonCycleDTO[]> => {
  const fetchURL = `${apiBaseUrl}/get-all-lesson-cycles?id=${scheduleId}`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-store', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};

export const PUT = async (request: NextRequest) => {
  const tag = 'electiveAssignments';

  console.log('Request inside API: ', request);

  const requestArray = await request.json();

  // const swapObject = [periodId1, periodId2, scheduleId];

  const fetchURL = `${apiBaseUrl}/swap-periods-in-schedule`;

  try {
    const response = await fetch(fetchURL, {
      // next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-store', //cacheSetting *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(requestArray) // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return [];
    }

    return response;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};

export const fetchBuildMetricDto = async (
  scheduleId: number
): Promise<BuildMetricDTO> => {
  const fetchURL = `${apiBaseUrl}/get-build-metric-dto?scheduleId=${scheduleId}`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-store', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return { id: 'failed' };
  }
};
