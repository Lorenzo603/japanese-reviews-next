'use client'

import '../globals.css'
import { Noto_Sans_JP } from 'next/font/google'
import { QuizContextProvider } from '@/app/context/quizContext'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { SuperTokensProvider } from '@/app/components/supertokens/supertokensProvider';
import { AccessDeniedScreen } from 'supertokens-auth-react/recipe/session/prebuiltui';
import { UserRoleClaim } from 'supertokens-auth-react/recipe/userroles';


const notoSansJp = Noto_Sans_JP({
    // weight: ['400', '500', '700'],
    // style: ['normal'],
    subsets: ['latin'],
    preload: true,
    display: 'block',
    variable: '--font-noto-sans-jp',
  })

export default function DashboardLayout({ children }) {
    return (
        <html lang="en" className={`${notoSansJp.variable}`}>
            <SuperTokensProvider>
                <body className="bg-dashboardBackgroundDark">
                    <SessionAuth
                        accessDeniedScreen={AccessDeniedScreen}
                        overrideGlobalClaimValidators={(globalValidators) => [
                            ...globalValidators, UserRoleClaim.validators.includes("FullReviewRole"),
                        ]}
                    >
                        <QuizContextProvider>
                            {children}
                        </QuizContextProvider>
                    </SessionAuth>
                </body>
            </SuperTokensProvider>
        </html>
    )
}
