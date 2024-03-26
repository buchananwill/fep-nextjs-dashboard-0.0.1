import { DataLink } from '../../api/zod-mods';
import { LinkComponent } from '../links/link-component';
import React from 'react';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function getLinkElements<T extends HasNumberIdDto>(
  links: DataLink<T>[]
) {
  return links.map((l, index) => (
    <LinkComponent key={`link-${l.id}`} linkData={l} linkIndex={index} />
  ));
}
