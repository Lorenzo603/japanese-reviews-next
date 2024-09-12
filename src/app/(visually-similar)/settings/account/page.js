'use client'

import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { AccessDeniedScreen } from 'supertokens-auth-react/recipe/session/prebuiltui'

export default function SettingsAccount() {


  return (
    <SessionAuth accessDeniedScreen={AccessDeniedScreen}>

      <main>
        <div className="w-full">

          <div className="mx-auto max-w-7xl p-6 flex flex-col items-center">
            <section>
              <h1 className="text-2xl">Profile</h1>

            </section>


          </div>
        </div >
      </main >

    </SessionAuth>

  )
}
