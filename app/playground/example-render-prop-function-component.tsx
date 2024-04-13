'use client';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../api/dtos/HasNameDtoSchema';
import { isNotUndefined, ObjectPlaceholder } from '../api/main';
import { PendingOverlay } from '../generic/components/overlays/pending-overlay';
import { Button } from '@nextui-org/button';
import { Badge } from '@tremor/react';
import { DtoComponentWrapperRenderProps } from './dto-component-wrapper';

export function ExampleRenderPropFunctionComponent<
  T extends HasNumberIdDto & HasNameDto
>({ entity, dispatchWithoutControl }: DtoComponentWrapperRenderProps<T>) {
  const handleClick = () => {
    if (isNotUndefined(dispatchWithoutControl))
      dispatchWithoutControl((dto) => ({ ...dto, name: `${dto.name}ol` }));
  };

  return (
    <>
      {<PendingOverlay pending={entity === ObjectPlaceholder} />}
      <Button onPress={handleClick}>Current name: {entity.name}</Button>
      <Badge>Current id: {entity.id}</Badge>
    </>
  );
}
