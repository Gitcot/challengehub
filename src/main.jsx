import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChallengeProvider } from './context/ChallengeContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChallengeProvider>
      <App />
    </ChallengeProvider>
  </StrictMode>,
)