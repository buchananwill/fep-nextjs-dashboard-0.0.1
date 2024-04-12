'use client';
import { useSelectiveContextGlobalListener } from '../selective-context/components/global/selective-context-manager-global';
import { ObjectPlaceholder } from '../selective-context/components/typed/selective-context-manager-function';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { Badge, Card } from '@tremor/react';
import {
  useDtoStoreDispatch,
  useDtoStoreListener
} from '../selective-context/hooks/dtoStores/use-dto-store';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../api/dtos/HasNameDtoSchema';
import { isNotUndefined } from '../api/main';
import { PendingOverlay } from '../generic/components/overlays/pending-overlay';
import { Button } from '@nextui-org/button';

export default function SomeComponentInterestedInADto<
  T extends HasNumberIdDto & HasNameDto
>({ entityName, id }: { entityName: string; id: string | number }) {
  const { currentState, dispatchWithoutControl } = useDtoStoreDispatch<T>(
    id,
    entityName,
    'someComponent'
  );
  console.log(currentState);

  const handleClick = () => {
    dispatchWithoutControl((dto) => ({ ...dto, name: `${dto.name}ol` }));
  };

  return (
    <Card>
      {<PendingOverlay pending={currentState === ObjectPlaceholder} />}
      <Button onPress={handleClick}>Current name: {currentState.name}</Button>
      <Badge>Current id: {currentState.id}</Badge>
    </Card>
  );
}
