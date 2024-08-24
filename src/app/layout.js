import './globals.css'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SuperTokensProvider } from "./components/supertokens/supertokensProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Japanese Reviews Next',
  description: 'Japanese Reviews Next',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className={`${inter.className} h-screen bg-pink-50 text-slate-900`}>
          {children}
        </body>
      </SuperTokensProvider>
    </html>
  )
}
