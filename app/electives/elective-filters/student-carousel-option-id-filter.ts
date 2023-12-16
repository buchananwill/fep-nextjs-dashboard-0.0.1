import { ElectivePreferenceDTO, StudentDTO } from '../../api/dto-interfaces';
import {
  Predicate,
  PredicateFactory
} from '../../components/filters/filter-types';

export default function studentCarouselOptionIdFilterSupplier(
  electivePreferences: Map<number, ElectivePreferenceDTO[]>,
  carouselOptionIdSet: Set<number>
): PredicateFactory<StudentDTO> {
  const predicate: Predicate<StudentDTO> = (student: StudentDTO) => {
    const foundPreferences = electivePreferences.get(student.id);
    if (!foundPreferences) return false;
    return foundPreferences.some(({ assignedCarouselOptionId }) =>
      carouselOptionIdSet.has(assignedCarouselOptionId)
    );
  };
  return () => {
    return predicate;
  };
}
