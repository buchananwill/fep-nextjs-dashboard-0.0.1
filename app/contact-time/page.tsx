import SubjectContactTime from './all-subjects-scatterchart';
import { fetchAllSubjectsContactTime } from '../api/actions/request-subject-contact-time-metrics';

export default async function SubjectsContactTime() {
  const actionResponse = await fetchAllSubjectsContactTime();

  if (actionResponse.data) {
    return <SubjectContactTime data={actionResponse.data} />;
  } else return <p>No data.</p>;
}
