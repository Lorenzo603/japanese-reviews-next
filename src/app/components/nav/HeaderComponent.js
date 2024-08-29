'use client'

import { usePathname } from 'next/navigation'
import HeaderMain from './HeaderMain';
import HeaderReview from './HeaderReview';

const HeaderComponent = () => {

    const pathname = usePathname()

    return (
        pathname === '/visually-similar/review' ? (
            <HeaderReview />
        ) : (
            <HeaderMain />
        )
    );
}

export default HeaderComponent;