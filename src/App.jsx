import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Home'
import ItemListContainer from './components/ItemListContainer/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/productos"
          element={
            <ItemListContainer
              categoriaActiva={categoriaActiva}
              busqueda={busqueda}
            />
          }
        />
        <Route path="/detalle/:id" element={<ItemDetailContainer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App