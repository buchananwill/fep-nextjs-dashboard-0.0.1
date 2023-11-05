import { ElectiveAvailability } from './elective-subscriber-disclosure-group';
import { ElectiveDTO, ElectivePreferenceDTO } from '../api/dto-interfaces';

export function compileElectiveAvailability(
  electives: ElectiveDTO[]
): ElectiveAvailability {
  const responseElectiveAvailability: ElectiveAvailability = {};
  electives.forEach((electiveDTO) => {
    const nextCourse = electiveDTO.name;
    if (
      responseElectiveAvailability[nextCourse] &&
      electiveDTO.subscriberPartyIDs.length > 0
    ) {
      const updatedAvailability = [
        ...responseElectiveAvailability[nextCourse],
        electiveDTO.carouselId
      ];
      responseElectiveAvailability[nextCourse] = updatedAvailability;
    } else {
      if (electiveDTO.subscriberPartyIDs.length > 0)
        responseElectiveAvailability[nextCourse] = [-1, electiveDTO.carouselId];
    }
  });
  return responseElectiveAvailability;
}

export function checkAssignment(
  electivePreferences: ElectivePreferenceDTO[],
  preferencePosition: number
): boolean {
  if (!electivePreferences[preferencePosition].isActive) return true;
  const referenceAssignment =
    electivePreferences[preferencePosition].assignedCarouselId;

  return !electivePreferences.some(
    (otherPreference) =>
      otherPreference.isActive &&
      otherPreference.preferencePosition !== preferencePosition &&
      otherPreference.assignedCarouselId === referenceAssignment
  );
}
