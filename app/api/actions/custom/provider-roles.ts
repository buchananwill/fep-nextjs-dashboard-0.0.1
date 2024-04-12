'use server';
import { ActionResponsePromise } from '../actionResponse';
import { API_BASE_URL, isNotUndefined } from '../../main';
import { postEntitiesWithDifferentReturnType } from '../template-actions';
import { ProviderRoleDto } from '../../dtos/ProviderRoleDtoSchema';
import { NewProviderRoleDto } from '../../dtos/NewProviderRoleDtoSchema-Validation';
import { getAll } from '../../READ-ONLY-generated-actions/ProviderRoleType';
import { getByTypeIdList } from '../../READ-ONLY-generated-actions/ProviderRole';

const url = `${API_BASE_URL}/providers`;

const teachersUrl = `${url}/teachers`;

export async function createTeacher(
  formData: NewProviderRoleDto
): ActionResponsePromise<ProviderRoleDto> {
  console.log('Creating teacher...');
  return postEntitiesWithDifferentReturnType(formData, teachersUrl);
}

export async function getTeachersV2() {
  return getAll()
    .then((r) => {
      if (isNotUndefined(r.data)) {
        const teacherType = r.data.find(
          (roleType) => roleType.name.toLowerCase() === 'teacher'
        );
        if (isNotUndefined(teacherType))
          return getByTypeIdList([teacherType.id]);
      }
    })
    .then((r) => {
      if (isNotUndefined(r) && isNotUndefined(r.data)) return r.data;
      else return [];
    })
    .catch((e) => console.error(e));
}
