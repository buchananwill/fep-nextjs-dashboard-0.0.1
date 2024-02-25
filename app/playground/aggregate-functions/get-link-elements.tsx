import { DataLink } from '../../api/zod-mods';
import { ProductComponentDto } from '../../api/dtos/ProductComponentDtoSchema';
import { LinkComponent } from '../links/link-component';
import React from 'react';

export function getLinkElements<T>(links: DataLink<T>[]) {
  return links.map((l, index) => (
    <LinkComponent key={`link-${l.id}`} linkData={l} linkIndex={index} />
  ));
}
