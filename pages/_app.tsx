import '../styles/globals.css'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { ClerkProvider, SignIn, useAuth } from '@clerk/nextjs'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

const ConvexProviderWithClerk = ({
  children,
  client,
  loading,
  loggedOut,
}: {
  children?: ReactNode
  client: any
  loading?: ReactElement
  loggedOut?: ReactElement
}) => {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const [clientAuthed, setClientAuthed] = useState(false)

  useEffect(() => {
    async function setAuth() {
      const token = await getToken({ template: 'convex', skipCache: true })
      if (token) {
        client.setAuth(() => {
          return token
        })
        setClientAuthed(true)
      }
    }
    if (isSignedIn) {
      const intervalId = setInterval(() => setAuth(), 50000)
      setAuth()
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [client, getToken, isSignedIn])

  if (!isLoaded || (isSignedIn && !clientAuthed)) {
    return loading || null
  } else if (!isSignedIn) {
    return loggedOut || <SignIn />
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} loading={<div>loading...</div>}>
        <Component {...pageProps} />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

export default MyApp
