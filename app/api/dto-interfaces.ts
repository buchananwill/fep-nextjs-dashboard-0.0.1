export interface ArrayDTO<T> {
  allItems: T[];
}

export interface StudentDTO extends Nameable, HasNumberId {
  yearGroup: number;
}

export interface NamedNumberRecord extends Nameable {
  stringIntegerMap: Record<string, number>;
}

export interface ElectiveDTO extends Nameable, HasUuid, HasNumberId {
  electiveOrdinal: number;
  carouselOrdinal: number;
  subscriberUserRoleIds: number[];
}

export interface HasNumberId {
  id: number;
}

export interface LessonCycleDTO extends Nameable, HasNumberId {
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
  uuid: string;
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

export interface ElectivePreferenceDTO extends Nameable {
  userRoleId: number;
  uuid: string;
  preferencePosition: number;
  assignedCarouselOptionId: number;
  isActive: boolean;
}

export interface YearGroupElectives {
  yearGroupRankInt: number;
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
  periodId: number | null; // TypeScript doesn't have a 'Long' type, so 'number' is typically used
  startTime: string | null; // LocalTime can be represented as a string in ISO format
  endTime: string | null;
  dayOfWeek: string | null;
  dayOfCycle: number | null;
  cycleLengthInDays: number | null;
  cycleId: string | null;
}
