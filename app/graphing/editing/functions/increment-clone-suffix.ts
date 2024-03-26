import { NameCharLimit } from '../../graph-types/organization/clone-organization-node';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import _ from 'lodash';

const CloneSuffixPattern = /\(\d+\)$/;

export function incrementCloneSuffix(name: string) {
  let cloneName;
  if (CloneSuffixPattern.test(name)) {
    const lastOpenParenthesis = name.lastIndexOf('(');
    const cloneCounter = name.substring(
      lastOpenParenthesis + 1,
      name.length - 1
    );
    try {
      const cloneCounterInt = parseInt(cloneCounter);
      cloneName = `${name.substring(0, lastOpenParenthesis)} (${
        cloneCounterInt + 1
      })`;
    } catch (error) {
      console.error(error);
    }
  }
  if (cloneName === undefined) cloneName = `${name} (1)`;
  cloneName =
    cloneName.length > NameCharLimit
      ? cloneName.substring(cloneName.length - NameCharLimit)
      : cloneName;
  return cloneName;
}

export function deDuplicateNames<T extends HasNameDto>(
  listOfNamedEntities: T[]
) {
  const set = new Set<string>();
  return listOfNamedEntities.map((entity) => {
    let name = entity.name;
    while (set.has(name)) {
      name = incrementCloneSuffix(name);
    }
    set.add(name);
    const clonedEntity = _.cloneDeep(entity);
    clonedEntity.name = name;
    return clonedEntity;
  });
}
