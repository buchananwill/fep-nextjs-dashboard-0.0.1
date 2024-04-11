'use server';
import { ElectivePreferenceDTO } from '../../dtos/ElectivePreferenceDTOSchema';
import { putEntities } from '../template-actions';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

const fetchURL = `option-block-assignments`;
const completeUrl = `${apiBaseUrl}/electives/${fetchURL}`;

export async function putOptionBlockAssignments(
  ePrefList: ElectivePreferenceDTO[]
) {
  return putEntities(ePrefList, completeUrl);
}
