import { HasUuid, Nameable } from './dto-interfaces';
import { FilterType } from '../electives/elective-filter-reducers';

export interface LessonCycle extends Nameable, HasUuid {
  periodVenueAssignments: Map<number, string>;
  enrolledStudentIds: Set<number>;
  assignedTeacherIds: Set<number>;
  requiredNumberOfPeriods: number;
  subject: string;
}

export interface ElectiveAvailability {
  [key: string]: number[];
}

export interface FilterOption<T extends string | number> {
  URI: T;
  label: string;
  operator: FilterType;
}
