import { FormEvent, useEffect, useState } from 'react'
import { useMutation, useQuery } from '../convex/_generated/react'
import { 
  useAuth,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs'

export default function App() {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const messages = useQuery('listMessages') || []

  const [newMessageText, setNewMessageText] = useState('')
  const sendMessage = useMutation('sendMessage')

  const [name, setName] = useState('user')

  useEffect(() => {
    setName('User ' + Math.floor(Math.random() * 10000))
  }, [])

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
    setNewMessageText('')
    await sendMessage(newMessageText, name)
  }

  return (
    <main>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>      
      <h1>Convex Chat</h1>
      <p className="badge">
        <span>{name}</span>
      </p>
      <ul>
        {messages.map((message) => (
          <li key={message._id.toString()}>
            <span>{message.author}:</span>
            <span>{message.body}</span>
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
          placeholder="Write a message…"
        />
        <input type="submit" value="Send" disabled={!newMessageText} />
      </form>
    </main>
  )
}
