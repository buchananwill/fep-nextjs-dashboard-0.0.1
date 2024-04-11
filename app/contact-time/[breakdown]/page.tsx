import { PerSubjectDonut } from '../per-subject-donut';
import { fetchAllSubjectsByYearGroupContactTime } from '../../api/actions/custom/request-subject-contact-time-metrics';
import { transformRecordToObjectArray } from '../../utils/data-transformations';
import { NamedNumberRecord } from '../../api/dto-interfaces';
function sumIntegers(b: NamedNumberRecord) {
  return Object.entries(b.stringIntegerMap)
    .map((entry) => entry[1])
    .reduce((total, entry) => entry + total, 0);
}

function dataComparator(a: NamedNumberRecord, b: NamedNumberRecord): number {
  if (a.stringIntegerMap && b.stringIntegerMap) {
    return sumIntegers(b) - sumIntegers(a);
  } else if (a.stringIntegerMap && !b.stringIntegerMap) return -1;
  else if (!a.stringIntegerMap && b.stringIntegerMap) return 1;
  else if (a.name && b.name) return a.name.localeCompare(b.name);
  else return -1;
}

export default async function ContactTimeBreakdownPage() {
  const actionResponse = await fetchAllSubjectsByYearGroupContactTime();

  if (actionResponse.data === undefined) {
    return <div>No data...</div>;
  }

  const bigRestructuredData = actionResponse.data
    .sort((a, b) => dataComparator(a, b))
    .map((dataUnit) => ({
      name: dataUnit.name,
      objectArray: transformRecordToObjectArray(dataUnit.stringIntegerMap)
    }));

  return <PerSubjectDonut data={bigRestructuredData}></PerSubjectDonut>;
}
