import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import DtoController from './dto-controller';
import { useMemo } from 'react';
import DtoListController from './dto-id-list-controller';
import { EmptyArray, HasId } from '../../../api/main';
import { useSelectiveContextAnyController } from '../global/selective-context-manager-global';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';

export interface DtoControllerArrayProps<
  T extends HasNumberIdDto | HasUuidDto
> {
  dtoArray: T[];
  entityName: string;
  commitServerAction?: (entityList: T[]) => ActionResponsePromise<T[]>;
}

function getEntityNamespaceKey<T extends HasId>(entityName: string, dto: T) {
  return `${entityName}:${dto.id}`;
}

export default function DtoControllerArray<T extends HasId>({
  dtoArray,
  entityName,
  commitServerAction
}: DtoControllerArrayProps<T>) {
  return (
    <>
      <DtoListController
        dtoList={dtoArray}
        entityName={entityName}
        commitServerAction={commitServerAction}
      />
      {dtoArray.map((dto) => (
        <DtoController
          key={getEntityNamespaceKey(entityName, dto)}
          dto={dto}
          entityName={entityName}
        />
      ))}
    </>
  );
}
