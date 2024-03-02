'use client';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/20/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import ProtectedNavigation from '../navbar/protected-navigation';
import { zeroIndexToOneIndex } from '../curriculum-models/[yearGroup]/page';
const buttonClassName = 'btn  relative btn-primary btn-outline';
const svgClassName = 'h-5 w-5 ';

/**
 * Uses one-indexing for human readability!
 * */
export function Pagination({
  first,
  last,
  pageNumber,
  lastPage,
  unsavedContextKey
}: {
  first: boolean;
  last: boolean;
  pageNumber: number;
  lastPage?: number;
  unsavedContextKey?: string;
}) {
  const appRouterInstance = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [buttonActive, setButtonActive] = useState<number | undefined>(
    undefined
  );

  function directToPage(nextPageNum: number) {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      params.set('page', nextPageNum.toString());
      const redirectUrl = `${pathname}?${params.toString()}`;
      appRouterInstance.push(redirectUrl, { scroll: false });
    });
  }

  useEffect(() => {
    if (!pending) {
      setButtonActive(undefined);
    }
  }, [pending]);

  const handleClick = (forwards: boolean) => {
    const nextPageNum = forwards ? pageNumber + 1 : pageNumber - 1;
    setButtonActive(forwards ? 3 : 2);
    directToPage(nextPageNum);
  };

  const toFirstPage = () => {
    setButtonActive(1);
    directToPage(1);
  };
  const toLastPage = () => {
    setButtonActive(4);
    if (lastPage) directToPage(zeroIndexToOneIndex(lastPage));
  };

  const loadingSpinner = 'loading loading-spinner loading-xs absolute';

  return (
    <div className={'my-2 gap-x-1 flex'}>
      {!!lastPage && (
        <ProtectedNavigation
          className={`${buttonClassName}`}
          disabled={first || pending}
          onConfirm={toFirstPage}
          unsavedContextKey={unsavedContextKey}
          unsavedListenerKey={'first'}
        >
          {buttonActive === 1 && <span className={loadingSpinner}></span>}
          <ChevronDoubleLeftIcon
            className={svgClassName}
          ></ChevronDoubleLeftIcon>
        </ProtectedNavigation>
      )}
      <ProtectedNavigation
        className={`${buttonClassName}`}
        disabled={first || pending}
        onConfirm={() => handleClick(false)}
        unsavedContextKey={unsavedContextKey}
        unsavedListenerKey={'back'}
      >
        {buttonActive === 2 && <span className={loadingSpinner}></span>}
        <ArrowLeftIcon className={svgClassName}></ArrowLeftIcon>
      </ProtectedNavigation>
      <ProtectedNavigation
        className={`${buttonClassName}`}
        onConfirm={() => handleClick(true)}
        disabled={last || pending}
        unsavedContextKey={unsavedContextKey}
        unsavedListenerKey={'forwards'}
      >
        {buttonActive === 3 && <span className={loadingSpinner}></span>}
        <ArrowRightIcon className={svgClassName}></ArrowRightIcon>
      </ProtectedNavigation>
      {!!lastPage && (
        <ProtectedNavigation
          className={`${buttonClassName}`}
          disabled={last || pending}
          onConfirm={toLastPage}
          unsavedContextKey={unsavedContextKey}
          unsavedListenerKey={'first'}
        >
          {buttonActive === 4 && <span className={loadingSpinner}></span>}
          <ChevronDoubleRightIcon
            className={svgClassName}
          ></ChevronDoubleRightIcon>
        </ProtectedNavigation>
      )}
    </div>
  );
}
