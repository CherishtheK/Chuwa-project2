import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './app/apolloClient.ts'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
)
