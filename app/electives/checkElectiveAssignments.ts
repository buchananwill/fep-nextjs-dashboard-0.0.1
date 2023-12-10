import { ElectiveDTO, ElectivePreferenceDTO } from '../api/dto-interfaces';
import { ElectiveAvailability } from '../api/state-types';

export function compileElectiveAvailability(
  electives: ElectiveDTO[]
): ElectiveAvailability {
  const responseElectiveAvailability: ElectiveAvailability = {};

  electives.forEach((electiveDTO) => {
    const nextCourse = electiveDTO.courseId;
    if (responseElectiveAvailability[nextCourse]) {
      responseElectiveAvailability[nextCourse] = [
        ...responseElectiveAvailability[nextCourse],
        electiveDTO.carouselOrdinal
      ].sort((a, b) => a - b);
    } else {
      responseElectiveAvailability[nextCourse] = [
        -1,
        electiveDTO.carouselOrdinal
      ];
    }
  });

  return responseElectiveAvailability;
}

export function checkAssignment(
  electiveDtoMapList: Map<string, ElectiveDTO>[],
  electivePreferences: ElectivePreferenceDTO[],
  preferencePosition: number
): boolean {
  if (!electivePreferences[preferencePosition - 1].active) return true;
  const { assignedCarouselOptionId: referenceAssignment, courseId } =
    electivePreferences[preferencePosition - 1];

  const carouselOrdinal = matchCarouselOrdinal(
    courseId,
    referenceAssignment,
    electiveDtoMapList
  );

  return !electivePreferences.some(
    (otherPreference) =>
      otherPreference.active &&
      otherPreference.preferencePosition !== preferencePosition &&
      matchCarouselOrdinal(
        otherPreference.courseId,
        otherPreference.assignedCarouselOptionId,
        electiveDtoMapList
      ) === carouselOrdinal
  );
}

export function matchCarouselOrdinal(
  uuid: string,
  carouselOptionId: number,
  electiveDtoMap: Map<string, ElectiveDTO>[]
): number {
  for (let i = 0; i < electiveDtoMap.length; i++) {
    const electiveDto = electiveDtoMap[i]?.get(uuid);

    if (electiveDto && electiveDto.id == carouselOptionId) {
      return i + 1; // Carousel Ordinal is one-indexed
    }
  }
  return -1;
}
