import { Card, Metric, Text, Title, BarList, Flex, Grid } from '@tremor/react';
import SubjectContactTime from './all-subjects-scatterchart';
import { fetchAllSubjectsContactTime } from '../api/request-subject-contact-time-metrics';
import { CacheSetting } from '../components/filter-dropdown';
import { wait } from 'next/dist/lib/wait';

async function fakeWaiting() {
  await wait(3000);
  return 'Again';
}

export default async function SubjectsContactTime() {
  const data = await fetchAllSubjectsContactTime();

  const waited = await fakeWaiting();

  return <SubjectContactTime data={data} />;
}
