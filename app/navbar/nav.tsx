import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';

import { fetchScheduleIds } from '../timetables/data-fetching-functions';

export default async function Nav() {
  const session = await getServerSession();

  const scheduleIds = await fetchScheduleIds();
  const latestSchedule =
    scheduleIds.length > 0 ? scheduleIds[scheduleIds.length - 1] : NaN;

  return <Navbar scheduleId={latestSchedule} user={session?.user} />;
}
