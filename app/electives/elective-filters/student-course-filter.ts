import { ElectivePreferenceDTO, StudentDTO } from '../../api/dto-interfaces';
import {
  Predicate,
  PredicateFactory
} from '../../components/filters/filter-types';

export default function StudentCourseFilterSupplier(
  electivePreferences: Map<number, ElectivePreferenceDTO[]>,
  courseIdSet: Set<string>
): PredicateFactory<StudentDTO> {
  const predicate: Predicate<StudentDTO> = (student: StudentDTO) => {
    const foundPreferences = electivePreferences.get(student.id);
    if (!foundPreferences) return false;
    return foundPreferences.some(({ courseId }) => courseIdSet.has(courseId));
  };
  return () => {
    return predicate;
  };
}
