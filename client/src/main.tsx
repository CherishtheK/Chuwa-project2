import '@ant-design/v5-patch-for-react-19'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import './index.css'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './app/apolloClient.ts'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store = {store}>
    <ApolloProvider client={client}>
      <StrictMode>
        <App />
      </StrictMode>
    </ApolloProvider>
  </Provider>

)
