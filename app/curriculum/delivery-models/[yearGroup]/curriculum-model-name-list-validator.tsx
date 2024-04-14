'use client';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { ReactNode, useEffect, useMemo } from 'react';
import { useCurriculumModelContext } from '../contexts/use-curriculum-model-context';
import { useSelectiveContextControllerStringList } from '../../../selective-context/components/typed/selective-context-manager-string-list';
import { EmptyIdArray } from '../contexts/curriculum-models-context-provider';

export const ValidatorContextKey = 'curriculum-model-name-list-validator';

export function nameAccessor<T extends HasNameDto>(entity: T) {
  return entity.name;
}

export function CurriculumModelNameListValidator({
  children
}: {
  children: ReactNode;
}) {
  const { curriculumModelsMap } = useCurriculumModelContext();
  const nameList = useMemo(() => {
    return Object.values(curriculumModelsMap).map(nameAccessor);
  }, [curriculumModelsMap]);
  const { dispatchUpdate } = useSelectiveContextControllerStringList(
    ValidatorContextKey,
    ValidatorContextKey,
    EmptyArray
  );
  useEffect(() => {
    dispatchUpdate({ contextKey: ValidatorContextKey, update: nameList });
  }, [nameList, dispatchUpdate]);

  return <>{children}</>;
}
