import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';

export interface CloneFunction<T extends HasNumberIdDto> {
  (object: T): T;
}