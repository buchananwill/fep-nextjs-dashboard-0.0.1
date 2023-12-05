import { NextRequest } from 'next/server';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export async function PUT(request: NextRequest) {
  const url = request.url;

  const startOfUrl = url.indexOf('/electives');

  const completeUrl = `${apiBaseUrl}${url.substring(startOfUrl)}`;

  const body = await request.json();

  console.log('Inside second function, request body: ', body);

  try {
    const response = await fetch(completeUrl, {
      // next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(body) // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return response;
    }

    return response;
  } catch (e) {
    const blob = new Blob();

    return new Response(blob, { status: 500, statusText: String(e) });
  }
}
