'use client'
 
import { useEffect, useState } from 'react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
 
export function NavigationEvents() {
  const pathname = usePathname() || "electives/";
  const searchParams = useSearchParams()
  const [prevPath, setPrevPath] = useState('')
  const [prevSearchParams, setPrevSearchParams] = useState<ReadonlyURLSearchParams>()
  const router = useRouter();
 
  useEffect(() => {
    const url = (searchParams) ? `${pathname}?${searchParams}` : pathname; 
    
  }, [pathname, searchParams])
  
  return null
}