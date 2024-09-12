import '../globals.css'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { SuperTokensProvider } from "../components/supertokens/supertokensProvider";
import HeaderComponent from '../components/nav/HeaderComponent';
import FooterComponent from '../components/nav/FooterComponent';
import { VisuallySimilarQuizContextProvider } from '../context/visuallySimilarQuizContext';
import { UserContextProvider } from '../context/userContext';

const inter = Inter({ subsets: ['latin'] })
const notoSansJp = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  style: ['normal'],
  preload: false,
  display: 'swap',
  variable: '--noto-sans-jp',
})

export const metadata = {
  title: 'Visually Similar Kanji Japanese Reviews',
  description: 'Browse and perform reviews on your knowledge of japanese visually similar kanji',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className={`${inter.className} ${notoSansJp.variable} h-screen bg-slate-50 text-slate-900`}>
          <UserContextProvider>
          <VisuallySimilarQuizContextProvider>
            <div className="relative flex flex-col h-full">
              <div>
                <HeaderComponent />
              </div>
              <div className='flex-grow'>
                {children}
              </div>
              <div>
                <FooterComponent />
              </div>
            </div>
          </VisuallySimilarQuizContextProvider>
          </UserContextProvider>
        </body>
      </SuperTokensProvider>
    </html>
  )
}
