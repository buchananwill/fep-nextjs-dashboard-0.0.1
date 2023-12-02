import { HasNumberId, HasUuid, Nameable } from './dto-interfaces';
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

export interface FilterOption {
  URI: string;
  label: string;
  operator: FilterType;
}
