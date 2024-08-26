'use client'

import '../globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { QuizContextProvider } from '@/app/context/quizContext'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { SSRProvider } from 'react-bootstrap';
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
                            <SSRProvider>
                                {children}
                            </SSRProvider>
                        </QuizContextProvider>
                    </SessionAuth>
                </body>
            </SuperTokensProvider>
        </html>
    )
}
