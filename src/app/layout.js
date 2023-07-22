import './globals.css'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import { QuizContextProvider } from './context/quizContext'
import { SecurityContextProvider } from './context/securityContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Japanese Reviews Next',
  description: 'Japanese Reviews Next',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SecurityContextProvider> */}
          <QuizContextProvider>
            {children}
          </QuizContextProvider>
        {/* </SecurityContextProvider> */}
      </body>
    </html>
  )
}
