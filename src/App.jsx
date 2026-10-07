import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, lazy, Suspense } from 'react'
import styles from './App.module.css'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthProvider } from './context/AuthContext'

import NavBar from './components/NavBar/NavBar.jsx'
import Footer from './components/Footer/Footer.jsx'
import CartDrawer from './components/CartDrawer/CartDrawer.jsx'
import Toast from './components/Toast/Toast.jsx'
import Home from './pages/Home/Home.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

// El resto de las vistas se descarga recién cuando el usuario entra a esa ruta
const ItemListContainer = lazy(() => import('./components/ItemListContainer/ItemListContainer.jsx'))
const ItemDetailContainer = lazy(() => import('./components/ItemDetailContainer/ItemDetailContainer.jsx'))
const Cart = lazy(() => import('./pages/Cart/Cart.jsx'))
const Favoritos = lazy(() => import('./pages/Favoritos/Favoritos.jsx'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout.jsx'))
const Login = lazy(() => import('./pages/Login/Login.jsx'))
const Register = lazy(() => import('./pages/Register/Register.jsx'))
const RecuperarPassword = lazy(() => import('./pages/RecuperarPassword/RecuperarPassword.jsx'))
const MisCompras = lazy(() => import('./pages/MisCompras/MisCompras.jsx'))
const Admin = lazy(() => import('./pages/Admin/Admin.jsx'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'))

// El ErrorBoundary se reinicia al cambiar de ruta (resetKey), así un error en una página no bloquea las demás
function RutasConProteccion({ children }) {
  const { pathname } = useLocation()
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
}

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
                <RutasConProteccion>
                  <Suspense fallback={<div className={styles.pageLoader}><span className={styles.spinner} /></div>}>
                    <Routes>
                      <Route path="/" element={<Home busqueda={busqueda} />} />
                      <Route path="/productos" element={<ItemListContainer busqueda={busqueda} />} />
                      <Route path="/category/:categoryId" element={<ItemListContainer busqueda={busqueda} />} />
                      <Route path="/item/:id" element={<ItemDetailContainer />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favoritos" element={<Favoritos />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/recuperar" element={<RecuperarPassword />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/mis-compras" element={<MisCompras />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </RutasConProteccion>
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
