import { Card, Title, Text } from '@tremor/react';
import fetchAllStudents from './api/actions/custom/student-search';
import Search from './search';
import StudentsTable from './tables/student-table';
import { StudentDTO } from './api/dtos/StudentDTOSchema';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const regex = new RegExp(search, 'i');

  const { data } = await fetchAllStudents(searchParams);

  let studentDTOs: StudentDTO[];

  if (data === undefined) studentDTOs = [];
  else studentDTOs = data;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-full px-6">
      <Title>Users</Title>
      <Text>A list of users retrieved from a PostgreSQL database.</Text>
      <Search />
      <Card className="mt-6">
        <StudentsTable students={studentDTOs} />
      </Card>
    </main>
  );
}
