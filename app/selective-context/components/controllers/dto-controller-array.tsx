import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import DtoController from './dto-controller';
import { useMemo } from 'react';
import DtoIdListController from './dto-id-list-controller';
import { EmptyArray, HasId } from '../../../api/main';
import { useSelectiveContextAnyController } from '../global/selective-context-manager-global';

export interface DtoControllerArrayProps<
  T extends HasNumberIdDto | HasUuidDto
> {
  dtoArray: T[];
  entityName: string;
}

function getEntityNamespaceKey<T extends HasId>(entityName: string, dto: T) {
  return `${entityName}:${dto.id}`;
}

export default function DtoControllerArray<T extends HasId>({
  dtoArray,
  entityName
}: DtoControllerArrayProps<T>) {
  const idListArray = useMemo(() => {
    return dtoArray.map((dto) => dto.id);
  }, [dtoArray]);

  return (
    <>
      <DtoIdListController idList={idListArray} entityName={entityName} />
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
