import { Card, Title, Text, Grid } from '@tremor/react';
import ClassRoomCard, { ClassRoomDTO } from './class-room-card';
import fetchClassRooms from '../../pages/api/premises/request-class-rooms';
import { type } from 'os';

export const dynamic = 'force-dynamic';

const sampleCard = {
  assetUUID: 'gibberish',
  name: 'W13',
  floor: 'Entrance Level',
  building: 'Lawtons House'
};

type ClassRoomsData = ClassRoomDTO[];

export default async function PremisesPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';

  const classRoomsData: ClassRoomsData = await fetchClassRooms();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Premises</Title>
      <Text>
        A list of all the rooms in the school. Total class rooms:{' '}
        <b>{classRoomsData.length}</b>
      </Text>
      <Grid numItems={4} className="gap-2 pt-2">
        {classRoomsData.map((value, index) => (
          <ClassRoomCard key={index} classRoomDTO={value} />
        ))}
      </Grid>
    </main>
  );
}
