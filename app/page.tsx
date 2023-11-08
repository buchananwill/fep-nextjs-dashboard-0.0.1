import { Card, Title, Text } from '@tremor/react';
import fetchResults from './api/student-search';
import Search from './search';
import StudentsTable from './tables/student-table';
import { ArrayDTO, StudentDTO } from './api/dto-interfaces';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';

  const studentDTO = await fetchResults(searchParams);
  const students: ArrayDTO<StudentDTO> = {
    allItems: studentDTO
  };

  const baseUrl = process.env.API_ACADEMIC_URL;

  const response = await fetch(`${baseUrl}/get-person`, {
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

  const person = await response.json();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-full px-6">
      <Title>Users</Title>
      <Text>A list of users retrieved from a PostgreSQL database.</Text>
      <Search />
      <Card className="mt-6">
        <StudentsTable students={students} />
      </Card>
    </main>
  );
}
