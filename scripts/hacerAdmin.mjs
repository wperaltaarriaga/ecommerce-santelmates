// Asigna el rol "admin" (custom claim) a un usuario de Firebase Authentication.
// Uso: node scripts/hacerAdmin.mjs email@ejemplo.com
// Requiere el archivo serviceAccountKey.json en la raíz del proyecto (NO se sube al repo).

import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const email = process.argv[2]
if (!email) {
  console.error('Falta el email. Uso: node scripts/hacerAdmin.mjs email@ejemplo.com')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))
initializeApp({ credential: cert(serviceAccount) })

const auth = getAuth()
const usuario = await auth.getUserByEmail(email)
await auth.setCustomUserClaims(usuario.uid, { admin: true })

console.log(`✅ ${email} ahora es admin. Cerrá sesión y volvé a entrar para que tome el rol.`)
