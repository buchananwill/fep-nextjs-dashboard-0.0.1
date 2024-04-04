import { FilterOption } from '../api/state-types';

import genericPredicateProducer from './elective-filters/elective-preference-factory-supplier';

import { FilterType } from './elective-filter-reducers';
import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';
import {
  packageRequest,
  PredicateProducer,
  PredicateRequest
} from '../generic/components/filters/filter-types';

export function filterStudentList(
  courseFilters: FilterOption<string>[],
  electivePreferences: Map<number, ElectivePreferenceDTO[]>,
  studentMap: Map<number, StudentDTO>,
  filterType: FilterType,
  pinnedStudents: Set<number>,
  carouselOptionIdSet: Set<number>
): StudentDTO[] {
  const filteredList: StudentDTO[] = [];
  console.log(carouselOptionIdSet, studentMap);
  const courseIdSet = new Set<string>();

  const strings = courseFilters.map((filterOption) => filterOption.URI);

  if (strings?.length > 0) {
    strings.forEach((string) => courseIdSet.add(string));
  }

  const coursePredicateFactoryList = courseFilters.map(({ URI }) =>
    genericPredicateProducer(
      electivePreferences,
      ({ courseId, active }) => active && URI == courseId
    )
  );

  const carouselOptionPredicateFactoryList: PredicateProducer<StudentDTO>[] =
    [];

  for (let number of carouselOptionIdSet) {
    carouselOptionPredicateFactoryList.push(
      genericPredicateProducer(
        electivePreferences,
        ({ assignedCarouselOptionId, active }) =>
          active && assignedCarouselOptionId == number
      )
    );
  }

  const pinnedStudentsPredicateFactory = genericPredicateProducer(
    electivePreferences,
    (preference) => pinnedStudents.has(preference.userRoleId)
  );

  const operatorValue = filterType == FilterType.all ? 'AND' : 'OR';

  const coursesAndOptionsRequest: PredicateRequest<StudentDTO> = {
    id: 0,
    name: 'Test',
    predicateProducerList: [
      ...coursePredicateFactoryList,
      ...carouselOptionPredicateFactoryList
    ],
    operator: operatorValue
  };

  const pinnedRequest: PredicateRequest<StudentDTO> = {
    id: 1,
    name: 'Pinned Test',
    predicateProducerList: [pinnedStudentsPredicateFactory],
    operator: 'AND',
    inversion: true
  };

  const pinnedFactoryInverted = packageRequest(pinnedRequest);

  const requestAsFactory = packageRequest(coursesAndOptionsRequest, false);

  const notPinnedAndOtherFilter: PredicateRequest<StudentDTO> = {
    id: 2,
    name: 'Not Pinned and is Filtered',
    predicateProducerList: [pinnedFactoryInverted, requestAsFactory],
    operator: 'AND'
  };

  const finalPackage = packageRequest(notPinnedAndOtherFilter);

  const completedPredicate = finalPackage();

  for (let value of studentMap.values()) {
    if (completedPredicate(value)) filteredList.push(value);
  }

  const pinnedStudentDtos: StudentDTO[] = [];

  if (pinnedStudents && pinnedStudents.size > 0) {
    pinnedStudents.forEach((studentId) => {
      const student = studentMap.get(studentId);
      student && pinnedStudentDtos.push(student);
    });
  }
  pinnedStudentDtos.sort((a, b) => a.name.localeCompare(b.name));
  filteredList.sort((a, b) => a.name.localeCompare(b.name));

  return [...pinnedStudentDtos, ...filteredList];
}
