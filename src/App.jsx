import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import styles from './App.module.css'

import NavBar from './components/NavBar/NavBar.jsx'
import Footer from './components/Footer/Footer.jsx'
import ItemListContainer from './components/ItemListContainer/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer'

import Checkout from './pages/Checkout/Checkout'
import NotFound from './pages/NotFound/NotFound.jsx'
import Home from './pages/Home'

function App() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <BrowserRouter>
      <div className={styles.page}>
        <NavBar busqueda={busqueda} setBusqueda={setBusqueda} />

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ItemListContainer busqueda={busqueda} />} />
            <Route path="/category/:categoryId" element={<ItemListContainer busqueda={busqueda} />} />
            <Route path="/item/:id" element={<ItemDetailContainer />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App