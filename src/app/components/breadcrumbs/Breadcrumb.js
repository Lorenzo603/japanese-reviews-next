'use client'

import { usePathname, useRouter } from "next/navigation";

export const Breadcrumb = () => {
  const router = useRouter();

  return (
    <div className="py-4">
      <button className="flex inline items-center" 
        onClick={() => router.back()}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
      </svg> 
      <span>Back</span>
      </button>
    </div>
  )
};

export default Breadcrumb;
