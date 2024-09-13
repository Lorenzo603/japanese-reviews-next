'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { AccessDeniedScreen } from 'supertokens-auth-react/recipe/session/prebuiltui'
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

export default function SettingsAccount() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

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
      return resJson;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return null;
    }
  }

  const handleUpdateUsername = async () => {
    try {
      const response = await fetch('/api/visually-similar/settings/account/update-username', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername })
      });

      const resJson = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          alert(resJson.message);
        }
        return;
      }

      setUsername(resJson.username);
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await fetch('/api/visually-similar/settings/account/update-email', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail, password })
      });

      const resJson = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          alert(resJson.message);
        }
        return;
      }

      setEmail(resJson.email);
      setNewEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  return (
    <SessionAuth accessDeniedScreen={AccessDeniedScreen}>
      <main>
        <div className="w-full">
          <div className="mx-auto max-w-7xl p-6 flex flex-col">
            <h1 className="text-2xl mb-2">Profile</h1>

            <section>
              <div className='flex flex-col gap-2 mb-6'>
                <h2 className="text-xl">Username</h2>
                <p>Your username is <span className='font-bold'>{username}</span></p>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="placeholder:text-slate-400 text-slate-700 bg-slate-50 border border-slate-400 rounded p-2"
                  />
                  <button
                    onClick={handleUpdateUsername}
                    className="p-2 bg-pink-500 hover:bg-pink-700 text-white rounded"
                  >
                    Update username
                  </button>
                </div>

              </div>
            </section>

            <section>
              <div className='flex flex-col gap-2 mb-6'>
                <h2 className="text-xl">Email</h2>
                <p>Your email address is <span className='font-bold'>{email}</span></p>
                <div className="flex flex-row gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                    className="placeholder:text-slate-400 text-slate-700 bg-slate-50 border border-slate-400 rounded p-2"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="placeholder:text-slate-400 text-slate-700 bg-slate-50 border border-slate-400 rounded p-2"
                  />
                  <button
                    onClick={handleUpdateEmail}
                    className="p-2 bg-pink-500 hover:bg-pink-700 text-white rounded"
                  >
                    Update email
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className='flex flex-col gap-4 mb-6'>
                <h2 className="text-xl">Password</h2>
                <div>
                  <Link href="/sign-in/reset-password"
                    className="p-2 bg-pink-500 hover:bg-pink-700 text-white rounded">
                    Reset Password
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <div className='flex flex-col gap-2 mb-4'>
                <h2 className="text-xl">Profile Image</h2>
                {/* Profile Image handling can be added here */}
              </div>
            </section>
          </div>
        </div>
      </main>
    </SessionAuth>
  );
}
