import { PerSubjectDonut } from '../per-subject-donut';
import {
  fetchAllSubjectsByYearGroupContactTime,
  fetchSingleSubjectByYearGroupContactTime
} from '../../api/request-subject-contact-time-metrics';
import { transformRecordToObjectArray } from '../../utils/data-transformations';
import { NamedNumberRecord } from '../../api/dto-interfaces';

interface Props {
  params: { breakdown: string };
}

function sumIntegers(b: NamedNumberRecord) {
  return Object.entries(b.stringIntegerMap)
    .map((entry) => entry[1])
    .reduce((total, entry) => (total += entry), 0);
}

function dataComparator(a: NamedNumberRecord, b: NamedNumberRecord): number {
  if (a.stringIntegerMap && b.stringIntegerMap) {
    return sumIntegers(b) - sumIntegers(a);
  } else if (a.stringIntegerMap && !b.stringIntegerMap) return -1;
  else if (!a.stringIntegerMap && b.stringIntegerMap) return 1;
  else if (a.name && b.name) return a.name.localeCompare(b.name);
  else return -1;
}

export default async function ContactTimeBreakdownPage({
  params: { breakdown }
}: Props) {
  const data = await fetchSingleSubjectByYearGroupContactTime('Maths');
  const allData = await fetchAllSubjectsByYearGroupContactTime();

  const recordToObjectArray = transformRecordToObjectArray(
    data.stringIntegerMap
  );

  const bigRestructuredData = allData
    .sort((a, b) => dataComparator(a, b))
    .map((dataUnit) => ({
      name: dataUnit.name,
      objectArray: transformRecordToObjectArray(dataUnit.stringIntegerMap)
    }));

  const restructuredData = {
    name: data.name,
    objectArray: recordToObjectArray
  };

  return <PerSubjectDonut data={bigRestructuredData}></PerSubjectDonut>;
}
