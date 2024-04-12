import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';
import { KnowledgeLevelDto } from '../api/dtos/KnowledgeLevelDtoSchema';
import { fetchScheduleIds } from '../api/actions/custom/timetables';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../api/main';
import { getDtoListByExampleList } from '../api/READ-ONLY-generated-actions/KnowledgeLevel';
import {
  getDtoListByExampleList as getServiceCategoryListByExampleList,
  getOne
} from '../api/READ-ONLY-generated-actions/ServiceCategory';

export default async function Nav() {
  const session = await getServerSession();

  const { data: scheduleIds } = await fetchScheduleIds();
  const latestSchedule =
    scheduleIds && scheduleIds.length > 0
      ? scheduleIds[scheduleIds.length - 1]
      : NaN;

  const { data: sCategory } = await getOne(SECONDARY_EDUCATION_CATEGORY_ID);

  const knowledgeLevelResponse = await getDtoListByExampleList([
    {
      serviceCategoryId: SECONDARY_EDUCATION_CATEGORY_ID
    }
  ]);

  const knowledgeLevels: KnowledgeLevelDto[] =
    knowledgeLevelResponse.data || [];

  return (
    <Navbar
      scheduleId={latestSchedule}
      knowledgeLevels={knowledgeLevels}
      serviceCategory={sCategory}
      user={session?.user}
    />
  );
}
