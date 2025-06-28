import '../globals.css'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { SuperTokensProvider } from "../components/supertokens/supertokensProvider";
import HeaderComponent from '../components/nav/HeaderComponent';
import FooterComponent from '../components/nav/FooterComponent';
import { VisuallySimilarQuizContextProvider } from '../context/visuallySimilarQuizContext';
import { UserContextProvider } from '../context/userContext';
import Image from 'next/image';

const inter = Inter({
  subsets: ['latin'],
  preload: true,
})
const notoSansJp = Noto_Sans_JP({
  // weight: ['400', '500', '700'],
  // style: ['normal'],
  subsets: ['latin'],
  preload: true,
  display: 'block',
  variable: '--font-noto-sans-jp',
})


export const metadata = {
  title: 'Visually Similar Kanji Japanese Reviews',
  description: 'Browse and perform reviews on your knowledge of japanese visually similar kanji',
}

export default function RootLayout({ children }) {

  const showComingSoon = true;

  if (showComingSoon) {
    return (
      <html lang="en" className={`${notoSansJp.variable}`}>
        <body className={`${inter.className} h-screen bg-pink-200 text-slate-900`}>
          <main className="min-h-screen flex items-center justify-center">
            <div className="w-full">
              <div className="mx-auto max-w-4xl p-6 flex flex-col items-center text-center">
                <div className="mb-8">
                  <Image src="/img/logos/tomomoji-logo-hires.png" alt="Tomomoji Logo"
                    width={3176}
                    height={800}
                    className="w-full max-w-2xl h-auto"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold text-pink-800">Coming Soon...</h1>
                </div>
              </div>
            </div>
          </main>
        </body>
      </html>

    );

  }

  return (
    <html lang="en" className={`${notoSansJp.variable}`}>
      <SuperTokensProvider>
        <body className={`${inter.className} h-screen bg-slate-50 text-slate-900`}>
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
