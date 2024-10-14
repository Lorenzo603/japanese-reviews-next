'use client'

import '../globals.css'
import { QuizContextProvider } from '@/app/context/quizContext'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { SuperTokensProvider } from '@/app/components/supertokens/supertokensProvider';
import { AccessDeniedScreen } from 'supertokens-auth-react/recipe/session/prebuiltui';
import { UserRoleClaim } from 'supertokens-auth-react/recipe/userroles';


export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <SuperTokensProvider>
                <body>
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
