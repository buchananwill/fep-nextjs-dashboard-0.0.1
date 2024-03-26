import { ElectivePreferenceDTO } from '../../api/dtos/ElectivePreferenceDTOSchema';
import { StudentDTO } from '../../api/dtos/StudentDTOSchema';
import {
  packagePredicate,
  Predicate,
  PredicateProducer
} from '../../generic/components/filters/filter-types';

type ElectivePreferenceCondition = (
  preference: ElectivePreferenceDTO
) => boolean;

export default function genericPredicateProducer(
  electivePreferences: Map<number, ElectivePreferenceDTO[]>,
  condition: ElectivePreferenceCondition
): PredicateProducer<StudentDTO> {
  const predicate: Predicate<StudentDTO> = (student: StudentDTO) => {
    const foundPreferences = electivePreferences.get(student.id);
    if (!foundPreferences) return false;
    return foundPreferences.some(condition);
  };
  return packagePredicate(predicate);
}
