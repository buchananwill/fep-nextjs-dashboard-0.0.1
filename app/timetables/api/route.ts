import { NextRequest } from 'next/server';
import { apiBaseUrl } from '../../api/actions/data-fetching-functions';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get('studentId');
  const scheduleId = searchParams.get('scheduleId');

  if (scheduleId && studentId) {
    const fetchURL = `${apiBaseUrl}/get-lesson-enrollments/${scheduleId}?studentId=${studentId}`;
    try {
      const response = await fetch(fetchURL, {
        next: { revalidate: 120 }
      });
      console.log('In the fetch function: ', response);
      return response;
    } catch (e) {
      console.error('Error: ', e);
      return new Response('', { status: 500 });
    }
  } else {
    return new Response('', { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const requestArray = await request.json();

  // const swapObject = [periodId1, periodId2, scheduleId];

  const fetchURL = `${apiBaseUrl}/swap-periods-in-schedule`;

  try {
    const response = await fetch(fetchURL, {
      // next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', //cacheSetting *default, no-cache, reload, force-cache, only-if-cached
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
      return new Response('', { status: 500 });
    }

    return response;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return new Response('', { status: 500 });
  }
};
