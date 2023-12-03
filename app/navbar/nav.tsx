import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';
import { fetchScheduleIds } from '../timetables/api/route';

export default async function Nav() {
  const session = await getServerSession();

  const scheduleIds = await fetchScheduleIds();
  const latestSchedule = scheduleIds[scheduleIds.length - 1];

  console.log('ids for navbar:', scheduleIds);
  console.log('latest: ', latestSchedule);

  return <Navbar scheduleId={latestSchedule} user={session?.user} />;
}
