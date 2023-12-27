export interface ArrayDTO<T> {
  allItems: T[];
}

export interface CarouselGroupDto extends HasUuid, Nameable {}

export interface StudentDTO extends Nameable, HasNumberId {
  yearGroup: number;
}

export interface NamedNumberRecord extends Nameable {
  stringIntegerMap: Record<string, number>;
}

export interface ElectiveDTO extends Nameable, HasNumberId {
  electiveOrdinal: number;
  carouselOrdinal: number; // one-indexed
  courseId: string;
  subscriberUserRoleIds: number[];
}

export interface HasNumberId {
  id: number;
}

export interface LessonEnrollmentDTO extends HasNumberId {
  lessonCycleId: string;
  periodId: number;
  userRoleId: number;
}

export interface LessonCycleDTO extends Nameable, HasUuid {
  periodVenueAssignments: Record<number, string>;
  enrolledStudentIds: number[];
  assignedTeacherIds: number[];
  requiredNumberOfPeriods: number;
  subject: string;
}

export interface Nameable {
  name: string;
}

export interface HasUuid {
  id: string;
}

export interface SubjectContactTimeDTO {
  subject: string;
  periods: number;
  teachers: number;
  perTeacher: number;
}

export interface AllSubjectsContactTimeDTO
  extends ArrayDTO<SubjectContactTimeDTO> {}

export interface ClassRoomDTO extends Nameable {
  uuid: string;
  floor: string;
  building: string;
}

export interface ElectivePreferenceDTO {
  userRoleId: number;
  courseName: string;
  courseId: string;
  preferencePosition: number; // one-indexed
  assignedCarouselOptionId: number;
  active: boolean;
}

export interface YearGroupElectives extends HasUuid, Nameable {
  carouselRows: number;
  carouselColumns: number;
  studentDTOList: StudentDTO[];
  electiveDTOList: ElectiveDTO[];
  electivePreferenceDTOList: ElectivePreferenceDTO[];
}

export interface ScheduleCellInfo {
  principalValue: string;
  leftBottom: string;
  rightBottom: string;
}

export interface TableContents {
  headerLabels: string[];
  tableRows: ScheduleCellInfo[][];
}

export interface CellDataAndMetaData<D> {
  cellData: D;
  cellRow: number;
  cellColumn: number;
}

export interface TabularDTO<H, D> {
  numberOfRows: number;
  numberOfColumns: number;
  headerData: H[];
  cellDataAndMetaData: CellDataAndMetaData<D>[];
}

export interface Period {
  description: string;
  periodId: number; // TypeScript doesn't have a 'Long' type, so 'number' is typically used
  startTime: string; // LocalTime can be represented as a string in ISO format
  endTime: string;
  dayOfWeek: string;
  dayOfCycle: number;
  cycleLengthInDays: number;
  cycleId: string;
}

export interface QueueTreeNodeDTO extends HasUuid {
  nodeNumber: number;
  netFailureCount?: number;
  taskSize?: number;
  batchSize?: number;
  totalAllocationArea?: number;
  degreeOfNesting?: number;
  yearGroup?: number;
  subjectContactTimeUnits?: { name: string; value: number }[];
}

export interface BuildMetricDTO extends HasUuid {
  scheduleId?: number;
  queueTreeNodes?: QueueTreeNodeDTO[];
  finalState?: string;
  totalAllocationLoops?: number;
}

export const notAnId = 'notAnId';

export interface LessonCycleMetricDTO extends HasNumberId {
  lessonCycleId: string;
  periodIdList: number[];
  infinityCostCount: number;
  finiteCostCount: number;
}

export interface LessonCycleMetricSummary extends HasUuid {
  lessonCycleMetrics: LessonCycleMetricDTO[];
  lessonCycleSummary: string;
}

export interface NameIdStringTuple extends HasUuid, Nameable {}

export interface NameIdNumberTuple extends HasNumberId, Nameable {}
