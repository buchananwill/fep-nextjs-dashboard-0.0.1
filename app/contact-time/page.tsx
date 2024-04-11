import SubjectContactTime from './all-subjects-scatterchart';
import { fetchAllSubjectsContactTime } from '../api/actions/custom/request-subject-contact-time-metrics';

export const dynamic = 'force-dynamic';

export default async function SubjectsContactTime() {
  const actionResponse = await fetchAllSubjectsContactTime();

  if (actionResponse.data) {
    return <SubjectContactTime data={actionResponse.data} />;
  } else return <p>No data.</p>;
}
