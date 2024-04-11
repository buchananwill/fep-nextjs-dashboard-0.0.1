import { getWithoutBody } from '../template-actions';
import { YearGroupWithElectivesDTO } from '../../dtos/YearGroupWithElectivesDTOSchema';

const apiBaseUrl = process.env.API_ACADEMIC_URL;
export const fetchCarouselGroupWithAllStudents = async (
  carouselGroupId: string
) => {
  const fetchURL = `${apiBaseUrl}/electives-yeargroup-with-all-students/${carouselGroupId}`;

  return getWithoutBody<YearGroupWithElectivesDTO>(fetchURL);
};
