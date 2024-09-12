'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { AccessDeniedScreen } from 'supertokens-auth-react/recipe/session/prebuiltui'
import { doesSessionExist } from 'supertokens-web-js/recipe/session'

export default function SettingsAccount() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function loadAccountSettings() {
      const sessionExists = await doesSessionExist();
      if (sessionExists) {
        const accountSettings = await loadAccountSettingsFromDatabase();
        if (accountSettings) {
          setUsername(accountSettings.username);
          setEmail(accountSettings.email);
        }
      }
    }
    loadAccountSettings();

  }, []);

  const loadAccountSettingsFromDatabase = async () => {
    try {
      const response = await fetch('/api/visually-similar/settings/account', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const resJson = await response.json();
      // console.log('Account Settings from DB:', resJson);
      return resJson;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return null;
    }
  }


  return (
    <SessionAuth accessDeniedScreen={AccessDeniedScreen}>

      <main>
        <div className="w-full">

          <div className="mx-auto max-w-7xl p-6 flex flex-col">
            <h1 className="text-2xl">Profile</h1>
            <section>
              <h2 className="text-xl">Username</h2>
              <div>{username}</div>

            </section>
            <section>
              <h2 className="text-xl">Email</h2>
              <div>{email}</div>
            </section>
            <section>
              <h2 className="text-xl">Password</h2>
              <Link href="/sign-in/reset-password">Reset Password</Link>

            </section>

            <section>
              <h2 className="text-xl">Profile Image</h2>

            </section>

          </div>
        </div >
      </main >

    </SessionAuth>

  )
}
