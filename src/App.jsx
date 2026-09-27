import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import styles from './App.module.css'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthProvider } from './context/AuthContext'

import NavBar from './components/NavBar/NavBar.jsx'
import Footer from './components/Footer/Footer.jsx'
import CartDrawer from './components/CartDrawer/CartDrawer.jsx'
import Toast from './components/Toast/Toast.jsx'
import Home from './pages/Home/Home.jsx'
import ItemListContainer from './components/ItemListContainer/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Favoritos from './pages/Favoritos/Favoritos.jsx'
import Checkout from './pages/Checkout/Checkout'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

function App() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <div className={styles.page}>
              <NavBar busqueda={busqueda} setBusqueda={setBusqueda} />
              <CartDrawer />
              <Toast />
              <main className={styles.main}>
                <Routes>
                  <Route path="/" element={<Home busqueda={busqueda} />} />
                  <Route path="/productos" element={<ItemListContainer busqueda={busqueda} />} />
                  <Route path="/category/:categoryId" element={<ItemListContainer busqueda={busqueda} />} />
                  <Route path="/item/:id" element={<ItemDetailContainer />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App