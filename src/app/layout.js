import './globals.css'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SuperTokensProvider } from "./components/supertokens/supertokensProvider";
import HeaderComponent from './components/nav/HeaderComponent';
import FooterComponent from './components/nav/FooterComponent';

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
  description: 'Visually Similar Kanji Japanese Reviews',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className={`${inter.className} ${notoSansJp.variable} h-screen bg-pink-50 text-slate-900`}>
          <div className="relative overflow-hidden">
            <HeaderComponent />
            {children}
            <FooterComponent />
          </div>
        </body>
      </SuperTokensProvider>
    </html>
  )
}
