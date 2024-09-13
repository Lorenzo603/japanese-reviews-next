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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
          setErrorMessage(resJson.message);
        }
        return;
      }

      setUsername(resJson.username);
      setNewUsername('');
      setSuccessMessage("Username updated successfully.");
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
          setErrorMessage(resJson.message);
        }
        return;
      }

      if (resJson.status === 'VERIFICATION_EMAIL_SENT') {
        setSuccessMessage(resJson.message);
        return;
      }

      setEmail(resJson.email);
      setNewEmail('');
      setPassword('');
      setSuccessMessage("Email updated successfully.");
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  return (
    <SessionAuth accessDeniedScreen={AccessDeniedScreen}>
      <main>
        <div className="w-full">
          <div className="mx-auto max-w-7xl p-6 flex flex-col">
            {
              errorMessage &&
              <div id="alert-2" className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 border border-red-500" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                <span className="sr-only">Info</span>
                <div className="ms-3 text-sm font-medium">
                  {errorMessage}
                </div>
                <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center 
                  justify-center h-8 w-8 border border-red-500" data-dismiss-target="#alert-2" aria-label="Close" onClick={() => setErrorMessage('')}>
                  <span className="sr-only">Close</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                </button>
              </div>
            }
            {
              successMessage &&
              <div id="alert-3" className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 border border-green-500" role="alert">
                <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div className="ms-3 text-sm font-medium">
                  {successMessage}
                </div>
                <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center
                 justify-center h-8 w-8 border border-green-500" data-dismiss-target="#alert-3" aria-label="Close" onClick={() => setSuccessMessage('')}>
                  <span className="sr-only">Close</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                </button>
              </div>
            }


            <h1 className="text-2xl mb-2">Profile</h1>
            <section>
              <div className='flex flex-col gap-2 mb-6'>
                <h2 className="text-xl">Username</h2>
                <p>Your username is <span className='font-bold'>{username}</span></p>
                <div className="flex flex-row flex-wrap gap-2">
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
                <div className="flex flex-row flex-wrap gap-2">
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

            {/* <section>
              <div className='flex flex-col gap-2 mb-4'>
                <h2 className="text-xl">Profile Image</h2>
              </div>
            </section> */}
          </div>
        </div>
      </main>
    </SessionAuth>
  );
}
