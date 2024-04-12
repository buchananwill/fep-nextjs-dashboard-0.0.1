import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import DtoController from './dto-controller';

export interface DtoControllerArrayProps<
  T extends HasNumberIdDto | HasUuidDto
> {
  dtoArray: T[];
  entityName: string;
}

export default function DtoControllerArray<
  T extends HasNumberIdDto | HasUuidDto
>({ dtoArray, entityName }: DtoControllerArrayProps<T>) {
  return dtoArray.map((dto) => (
    <DtoController
      key={`${entityName}:${dto.id}`}
      dto={dto}
      entityName={entityName}
    />
  ));
}
