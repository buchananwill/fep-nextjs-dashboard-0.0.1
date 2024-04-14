'use client';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { ReactNode, useEffect, useMemo } from 'react';
import { useSelectiveContextControllerStringList } from '../../../selective-context/components/typed/selective-context-manager-string-list';
import { EmptyArray, ObjectPlaceholder } from '../../../api/main';
import { useSelectiveContextGlobalListener } from '../../../selective-context/components/global/selective-context-manager-global';
import { getNameSpacedKey } from '../../../selective-context/components/controllers/dto-id-list-controller';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';

export const ValidatorContextKey = 'curriculum-model-name-list-validator';

export function nameAccessor<T extends HasNameDto>(entity: T) {
  return entity.name;
}

export function CurriculumModelNameListValidator({
  children
}: {
  children: ReactNode;
}) {
  const { currentState: curriculumModelsMap } =
    useSelectiveContextGlobalListener<StringMap<WorkProjectSeriesSchemaDto>>({
      contextKey: getNameSpacedKey('workProjectSeriesSchema', 'stringMap'),
      listenerKey: ValidatorContextKey,
      initialValue: ObjectPlaceholder
    });
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
