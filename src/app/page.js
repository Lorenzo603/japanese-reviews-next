'use client'

import { SSRProvider } from 'react-bootstrap';


export default function Home() {

  return (

    <SSRProvider>
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
    </SSRProvider>

  )
}
