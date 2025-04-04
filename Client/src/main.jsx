import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './global.css'
import './App.css'
import { AuthProvider } from './Context/caseAdapter'
import { LevelProvider } from './Context/LevelContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <LevelProvider>
          <App />
        </LevelProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
