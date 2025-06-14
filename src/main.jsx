import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Anasayfa from './Anasayfa.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Anasayfa />
  </StrictMode>,
)
