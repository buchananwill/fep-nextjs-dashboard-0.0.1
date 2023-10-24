import { ElectiveDTO } from "./elective-card"
import { ElectiveAvailability, ElectivePreference } from "./elective-subscriber-accordion"

export function compileElectiveAvailability(electives: ElectiveDTO[]): ElectiveAvailability {
    const responseElectiveAvailability: ElectiveAvailability = {}
    electives.forEach(electiveDTO => {
        
        const nextCourse = electiveDTO.courseDescription
        if (responseElectiveAvailability[nextCourse] && electiveDTO.subscriberPartyIDs.length > 0) {
            const updatedAvailability = [...responseElectiveAvailability[nextCourse], electiveDTO.carouselId]
            responseElectiveAvailability[nextCourse] = updatedAvailability
        } else {
            if (electiveDTO.subscriberPartyIDs.length > 0) responseElectiveAvailability[nextCourse] = [electiveDTO.carouselId]
        }
    })
    return responseElectiveAvailability;
}

export function checkAssignment(electivePreferences: ElectivePreference[], preferencePosition: number): boolean {

    if (!electivePreferences[preferencePosition].isActive) return true;
    const referenceAssignment = electivePreferences[preferencePosition].assignedCarousel;
  
    return !electivePreferences.some(otherPreference => 
      otherPreference.isActive &&
      otherPreference.preferencePosition !== preferencePosition &&
      otherPreference.assignedCarousel === referenceAssignment
    );
  }
  