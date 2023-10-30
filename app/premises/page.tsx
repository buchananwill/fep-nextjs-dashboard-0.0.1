import { Title, Text, Grid } from '@tremor/react';
import ClassRoomCard, { ClassRoomDTO } from './class-room-card';
import fetchClassRooms from '../api/request-class-rooms';
import { Suspense } from 'react';
import Loading from '../loading';

export const dynamic = 'force-dynamic';

type ClassRoomsData = ClassRoomDTO[];

export default async function PremisesPage({}: {
  searchParams: { q: string };
}) {
  const classRoomsData: ClassRoomsData = await fetchClassRooms();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Premises</Title>
      <Text>
        A list of all the rooms in the school. Total class rooms:{' '}
        <b>{classRoomsData.length}</b>
      </Text>
      <Suspense fallback={<Loading />}>
        <Grid numItems={4} className="gap-2 pt-2">
          {classRoomsData.map((value, index) => (
            <ClassRoomCard key={index} classRoomDTO={value} />
          ))}
        </Grid>
      </Suspense>
    </main>
  );
}
