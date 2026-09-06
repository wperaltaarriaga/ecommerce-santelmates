import { useState } from 'react'
import NavBar from './components/NavBar/NavBar'
import ItemListContainer from './components/ItemListContainer/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer.jsx'
import './App.css'

function App() {
  const greeting = "Mates para acompañar cada momento"

  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  return (
    <>      
      <NavBar
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />
      <ItemListContainer
        greeting={greeting}
        categoriaActiva={categoriaActiva}
        busqueda={busqueda}
      />

      <ItemDetailContainer productId={1} />
    </>
  )
}

export default App