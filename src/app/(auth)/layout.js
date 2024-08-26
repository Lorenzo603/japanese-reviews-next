import '../globals.css'
import { SuperTokensProvider } from "../components/supertokens/supertokensProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className="h-screen bg-pink-50 text-slate-900">
          {children}
        </body>
      </SuperTokensProvider>
    </html>
  )
}
