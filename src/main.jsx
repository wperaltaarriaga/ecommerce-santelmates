import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css"


createRoot(document.getElementById('root')).render( 
  // aca trae el contenedor de react y renderiza el componente App dentro de el
  <StrictMode> 
     <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
