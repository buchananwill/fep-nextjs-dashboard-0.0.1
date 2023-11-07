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
