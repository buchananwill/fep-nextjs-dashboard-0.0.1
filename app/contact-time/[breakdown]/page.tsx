import { PerSubjectDonut } from '../per-subject-donut';
import { fetchSingleSubjectByYearGroupContactTime } from '../../api/request-subject-contact-time-metrics';
import { transformRecordToObjectArray } from '../../utils/data-transformations';
import { da } from 'date-fns/locale';

interface Props {
  params: { breakdown: string };
}

export default async function ContactTimeBreakdownPage({
  params: { breakdown }
}: Props) {
  const data = await fetchSingleSubjectByYearGroupContactTime('Maths');

  const objectArray = transformRecordToObjectArray(data.stringIntegerMap);

  const restructuredData = { name: data.name, objectArray: objectArray };

  return <PerSubjectDonut data={restructuredData}></PerSubjectDonut>;
}
