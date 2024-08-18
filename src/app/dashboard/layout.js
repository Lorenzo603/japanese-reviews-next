'use client'

import { QuizContextProvider } from '@/app/context/quizContext'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { SSRProvider } from 'react-bootstrap';

export default function DashboardLayout({ children }) {
    return (
        <QuizContextProvider>
            <SessionAuth>
                <SSRProvider>
                    {children}
                </SSRProvider>
            </SessionAuth>
        </QuizContextProvider>
    )
}
