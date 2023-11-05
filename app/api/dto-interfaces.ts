export interface ArrayDTO<T> {
  allItems: T[];
}

export interface StudentDTO extends Nameable {
  id: number;
  yearGroup: number;
}

export interface NamedNumberRecord extends Nameable {
  stringIntegerMap: Record<string, number>;
}

export interface ElectiveDTO extends Nameable, Uuidable {
  // uuid = course.
  courseCarouselId: number;
  carouselId: number;
  subscriberPartyIDs: number[];
}

export interface Nameable {
  name: string;
}

export interface Uuidable {
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
  partyId: number;
  uuid: string;
  preferencePosition: number;
  assignedCarouselId: number;
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
