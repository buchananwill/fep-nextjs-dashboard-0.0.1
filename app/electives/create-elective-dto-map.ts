// Function to map the carousel options (Electives) to the carousels on which they're available.
import { ElectiveDTO } from '../api/dtos/ElectiveDTOSchema';

export function createElectiveDtoMap(
  electiveDtoList: ElectiveDTO[]
): Map<string, ElectiveDTO>[] {
  let max = 0;
  // Figure out how many carousels are needed by finding the max value for carousel ordinal.
  for (let electiveDTO of electiveDtoList) {
    max = Math.max(electiveDTO.carouselOrdinal, max);
  }

  const electiveDtoListMap: Map<string, ElectiveDTO>[] = [];

  // Create a distinct map for each carousel.
  for (let i = 0; i < max; i++) {
    electiveDtoListMap.push(new Map<string, ElectiveDTO>());
  }

  // For the entire electiveDtoList, find the right carousel and map the elective to the id of its course.
  electiveDtoList.forEach((electiveDto) =>
    // Carousel Ordinal is one-indexed
    electiveDtoListMap[electiveDto.carouselOrdinal - 1].set(
      electiveDto.courseId,
      electiveDto
    )
  );
  return electiveDtoListMap;
}