'use server';
import {
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { API_BASE_URL } from '../main';
import {
  getWithoutBody,
  patchEntityList,
  postEntitiesWithDifferentReturnType,
  postEntity
} from './template-actions';
import { ProviderRoleDto } from '../dtos/ProviderRoleDtoSchema';
import { NewProviderRoleDto } from '../dtos/NewProviderRoleDtoSchema';
import { isNotUndefined } from '../../graphing/editing/functions/graph-edits';

const url = `${API_BASE_URL}/providers`;

const teachersUrl = `${url}/teachers`;

export async function createTeacher(
  formData: NewProviderRoleDto
): ActionResponsePromise<ProviderRoleDto> {
  return postEntitiesWithDifferentReturnType(formData, teachersUrl);
}

export async function updateTeachers(
  teacherDtoList: ProviderRoleDto[]
): ActionResponsePromise<ProviderRoleDto[]> {
  // console.log('sending through to backend');
  // try {
  //   const teacherResponses = await Promise.all(
  //     teacherDtoList.map((t) => patchEntityList([t], teachersUrl))
  //   );
  //   const combinedArray: ProviderRoleDto[] = teacherResponses
  //     .map((r) => r.data)
  //     .filter(isNotUndefined)
  //     .reduce((prev, curr, index, filteredArray) => [...prev, ...curr], []);
  //   return successResponse(combinedArray);
  // } catch (e) {
  //   return errorResponse(`${e?.toString()}`);
  // }
  return patchEntityList(teacherDtoList, teachersUrl);
}

export async function getTeachers(): ActionResponsePromise<ProviderRoleDto[]> {
  return getWithoutBody(teachersUrl);
}
