import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap primero: así los estilos propios (index.css) le ganan
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/parisienne/400.css'
import '@fontsource/archivo-black/400.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)