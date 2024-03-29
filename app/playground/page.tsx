import SomeComponent from './some-component';
import { Card } from '@tremor/react';
import SelectiveContextManagerGlobal from '../selective-context/components/global/selective-context-manager-global';
import SomeButtonToControlGary from './some-button-to-control-gary';
import SomeComponentInterestedInGary from './some-component-interested-in-gary';

export default async function PlaygroundPage({}: {}) {
  return (
    <SelectiveContextManagerGlobal>
      <Card className={'flex gap-4'}>
        <SomeComponent />
        <SomeButtonToControlGary />
      </Card>
      <SomeComponentInterestedInGary></SomeComponentInterestedInGary>
    </SelectiveContextManagerGlobal>
  );
}
