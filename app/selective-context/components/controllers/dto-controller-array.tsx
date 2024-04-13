import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import DtoController from './dto-controller';
import { useMemo } from 'react';
import DtoIdListController from './dto-id-list-controller';
import { HasId } from '../../../api/main';

export interface DtoControllerArrayProps<
  T extends HasNumberIdDto | HasUuidDto
> {
  dtoArray: T[];
  entityName: string;
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
          key={`${entityName}:${dto.id}`}
          dto={dto}
          entityName={entityName}
        />
      ))}
    </>
  );
}
