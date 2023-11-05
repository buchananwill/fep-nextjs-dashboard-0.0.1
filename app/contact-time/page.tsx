import { Card, Metric, Text, Title, BarList, Flex, Grid } from '@tremor/react';
import SubjectContactTime from './all-subjects-scatterchart';
import { fetchAllSubjectsContactTime } from '../api/request-subject-contact-time-metrics';
import { CacheSetting } from '../components/filter-dropdown';

export default async function SubjectsContactTime() {
  const data = await fetchAllSubjectsContactTime();

  return <SubjectContactTime data={data} />;
}
