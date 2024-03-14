import {
  packagePredicate,
  Predicate,
  PredicateFactory
} from '../../components/filters/filter-types';
import { ElectivePreferenceDTO } from '../../api/dtos/ElectivePreferenceDTOSchema';
import { StudentDTO } from '../../api/dtos/StudentDTOSchema';

type ElectivePreferenceCondition = (
  preference: ElectivePreferenceDTO
) => boolean;

export default function genericPredicateFactorySupplier(
  electivePreferences: Map<number, ElectivePreferenceDTO[]>,
  condition: ElectivePreferenceCondition
): PredicateFactory<StudentDTO> {
  const predicate: Predicate<StudentDTO> = (student: StudentDTO) => {
    const foundPreferences = electivePreferences.get(student.id);
    if (!foundPreferences) return false;
    return foundPreferences.some(condition);
  };
  return packagePredicate(predicate);
}
