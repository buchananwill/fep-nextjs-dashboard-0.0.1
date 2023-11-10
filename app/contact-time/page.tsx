import SubjectContactTime from './all-subjects-scatterchart';
import { fetchAllSubjectsContactTime } from '../api/request-subject-contact-time-metrics';

export default async function SubjectsContactTime() {
  const data = await fetchAllSubjectsContactTime();

  return <SubjectContactTime data={data} />;
}
