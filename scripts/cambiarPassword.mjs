// Pone una contraseña nueva a un usuario de Firebase Authentication, sin email de por medio.
// Útil para cuentas de prueba con emails ficticios.
// Uso: node scripts/cambiarPassword.mjs email@ejemplo.com
// La contraseña se pide por teclado (así no queda guardada en el historial de la terminal).
// Requiere el archivo serviceAccountKey.json en la raíz del proyecto (NO se sube al repo).

import { readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const email = process.argv[2]
if (!email) {
  console.error('Falta el email. Uso: node scripts/cambiarPassword.mjs email@ejemplo.com')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))
initializeApp({ credential: cert(serviceAccount) })

const auth = getAuth()
const usuario = await auth.getUserByEmail(email)

const rl = createInterface({ input: process.stdin, output: process.stdout })
const password = await rl.question('Contraseña nueva (mínimo 6 caracteres): ')
rl.close()

if (password.length < 6) {
  console.error('La contraseña tiene que tener al menos 6 caracteres.')
  process.exit(1)
}

await auth.updateUser(usuario.uid, { password })

const esAdmin = usuario.customClaims?.admin === true
console.log(`✅ Contraseña actualizada para ${email}.`)
console.log(esAdmin ? '   Este usuario es admin.' : '   Ojo: este usuario NO es admin. Corré scripts/hacerAdmin.mjs si lo necesitás.')
