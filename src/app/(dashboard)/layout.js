'use client'

import '../globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { QuizContextProvider } from '@/app/context/quizContext'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { SSRProvider } from 'react-bootstrap';
import { SuperTokensProvider } from '@/app/components/supertokens/supertokensProvider';

export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <SuperTokensProvider>
                <body>
                    <QuizContextProvider>
                        <SessionAuth>
                            <SSRProvider>
                                {children}
                            </SSRProvider>
                        </SessionAuth>
                    </QuizContextProvider>
                </body>
            </SuperTokensProvider>
        </html>
    )
}
