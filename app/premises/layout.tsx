import { PropsWithChildren } from 'react';
import ServiceCategoryProvider from '../generic/providers/service-category-provider';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../api/main';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ServiceCategoryProvider
        serviceCategoryId={SECONDARY_EDUCATION_CATEGORY_ID}
      />
      {children}
    </>
  );
}
