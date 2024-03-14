export interface NamedNumberRecord extends Nameable {
  stringIntegerMap: Record<string, number>;
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
export interface ClassRoomDTO extends Nameable {
  uuid: string;
  floor: string;
  building: string;
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
export const notAnId = 'notAnId';
