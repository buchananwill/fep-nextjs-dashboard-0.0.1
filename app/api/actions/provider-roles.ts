'use server';
import {
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { API_BASE_URL, isNotUndefined } from '../main';
import {
  getWithoutBody,
  patchEntityList,
  postEntitiesWithDifferentReturnType,
  postEntity
} from './template-actions';
import { ProviderRoleDto } from '../dtos/ProviderRoleDtoSchema';
import { NewProviderRoleDto } from '../dtos/NewProviderRoleDtoSchema';

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
  return patchEntityList(teacherDtoList, teachersUrl);
}

export async function getTeachers(): ActionResponsePromise<ProviderRoleDto[]> {
  return getWithoutBody(teachersUrl);
}
