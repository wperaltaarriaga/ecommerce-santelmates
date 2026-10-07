import { createContext } from 'react'

// Los objetos de contexto viven en un archivo aparte (sin componentes)
// para que Fast Refresh funcione bien en los archivos de los Providers.
export const AuthContext = createContext(undefined)
export const CartDataContext = createContext(undefined)
export const CartActionsContext = createContext(undefined)
export const FavoritesContext = createContext(undefined)
