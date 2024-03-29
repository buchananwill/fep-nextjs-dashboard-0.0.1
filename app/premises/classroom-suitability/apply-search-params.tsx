'use client';
import { useSearchParamsContext } from '../../contexts/string-map-context/search-params-context-creator';
import { isNotNull, isNotUndefined } from '../../api/main';
import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PendingOverlay } from '../../generic/components/overlays/pending-overlay';
import ProtectedNavigation from '../../navbar/protected-navigation';

export function ApplySearchParams({
  buttonLabel,
  unsavedContextKey
}: {
  buttonLabel?: string;
  unsavedContextKey: string;
}) {
  const { searchParamsMap } = useSearchParamsContext();
  const pathname = usePathname();
  const { push } = useRouter();
  const [pending, startTransition] = useTransition();
  const handleApplyParams = () => {
    const params = new URLSearchParams();
    for (let searchParamsMapKey in searchParamsMap) {
      const updatedSelection = searchParamsMap[searchParamsMapKey];
      if (isNotNull(updatedSelection)) {
        params.set(searchParamsMapKey, updatedSelection.id);
      } else {
        params.delete(searchParamsMapKey);
      }
    }
    startTransition(() => {
      push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };
  return (
    <ProtectedNavigation
      onConfirm={handleApplyParams}
      unsavedContextKey={unsavedContextKey}
      unsavedListenerKey={'apply-params'}
    >
      <PendingOverlay pending={pending}></PendingOverlay>
      {isNotUndefined(buttonLabel) ? buttonLabel : 'Apply Filters'}
    </ProtectedNavigation>
  );
}
