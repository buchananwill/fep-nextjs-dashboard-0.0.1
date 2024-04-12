'use client';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import { useDtoStoreController } from '../../hooks/dtoStores/use-dto-store';

export interface DtoControllerProps<T extends HasNumberIdDto | HasUuidDto> {
  dto: T;
  entityName: string;
}

export default function DtoController<T extends HasNumberIdDto | HasUuidDto>({
  dto,
  entityName
}: DtoControllerProps<T>) {
  const { currentState } = useDtoStoreController(dto, entityName);
  console.log(currentState);
  return null;
}
