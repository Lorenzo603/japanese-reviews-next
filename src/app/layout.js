import './globals.css'
import { Inter, Noto_Sans_JP } from 'next/font/google'

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
        <body className={`${inter.className} ${notoSansJp.variable} h-screen bg-slate-50 text-slate-900`}>
          {children}
        </body>
    </html>
  )
}
