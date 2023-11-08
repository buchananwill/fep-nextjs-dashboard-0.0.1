import { HasNumberId, Nameable } from './dto-interfaces';
import { HasDisplayName } from '@headlessui/react/dist/utils/render';

export interface LessonCycle extends Nameable, HasNumberId {
  periodVenueAssignments: Map<number, string>;
  enrolledStudentIds: Set<number>;
  assignedTeacherIds: Set<number>;
  requiredNumberOfPeriods: number;
}
