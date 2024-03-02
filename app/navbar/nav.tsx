import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';

import { fetchScheduleIds } from '../timetables/data-fetching-functions';
import {
  getKnowledgeLevels,
  getServiceCategory
} from '../api/actions/service-categories';
import { KnowledgeLevelDto } from '../api/dtos/KnowledgeLevelDtoSchema';

export default async function Nav() {
  const session = await getServerSession();

  const scheduleIds = await fetchScheduleIds();
  const latestSchedule =
    scheduleIds.length > 0 ? scheduleIds[scheduleIds.length - 1] : NaN;

  const serviceCategoryResponse = await getServiceCategory(2);

  const knowledgeLevelResponse = await getKnowledgeLevels(2);

  const knowledgeLevels: KnowledgeLevelDto[] =
    knowledgeLevelResponse.data || [];

  const sCategory = serviceCategoryResponse.data;

  return (
    <Navbar
      scheduleId={latestSchedule}
      knowledgeLevels={knowledgeLevels}
      serviceCategory={sCategory}
      user={session?.user}
    />
  );
}
