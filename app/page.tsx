import { Card, Title, Text } from '@tremor/react';
import fetchResults from '../pages/api/students/student-search';
import Search from './search';
import StudentsTable from './table';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';

  const students = await fetchResults(searchParams);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>A list of users retrieved from a PostgreSQL database.</Text>
      <Search />
      <Card className="mt-6">
        <StudentsTable students={students} />
      </Card>
    </main>
  );
}
