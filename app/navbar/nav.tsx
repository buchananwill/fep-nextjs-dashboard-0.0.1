import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';

import {
  getKnowledgeLevels,
  getServiceCategoryByIdentifier
} from '../api/actions/custom/service-categories';
import { KnowledgeLevelDto } from '../api/dtos/KnowledgeLevelDtoSchema';
import { fetchScheduleIds } from '../api/actions/custom/timetables';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../api/main';

export default async function Nav() {
  const session = await getServerSession();

  const { data: scheduleIds } = await fetchScheduleIds();
  const latestSchedule =
    scheduleIds && scheduleIds.length > 0
      ? scheduleIds[scheduleIds.length - 1]
      : NaN;

  const serviceCategoryResponse = await getServiceCategoryByIdentifier(
    SECONDARY_EDUCATION_CATEGORY_ID.toString()
  );

  const knowledgeLevelResponse = await getKnowledgeLevels(
    SECONDARY_EDUCATION_CATEGORY_ID.toString()
  );

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
