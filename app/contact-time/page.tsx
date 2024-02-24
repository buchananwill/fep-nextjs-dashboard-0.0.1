import SubjectContactTime from './all-subjects-scatterchart';
import { fetchAllSubjectsContactTime } from '../api/actions/request-subject-contact-time-metrics';

export default async function SubjectsContactTime() {
  const data = await fetchAllSubjectsContactTime();

  if (data) {
    return <SubjectContactTime data={data} />;
  } else return <p>No data.</p>;
}
