import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// In a real app, this should be in .env.local
// For this quick fix, we use a fallback to ensure it always works without breaking
const secretKey = process.env.SESSION_SECRET || 'a-very-secure-random-secret-key-that-should-be-in-env-32-chars-long'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Session expires in 2 hours
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function createSession(nis: string) {
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const session = await encrypt({ nis, expires })

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    expires,
    httpOnly: true, // Prevents XSS attacks via document.cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // CSRF protection
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  
  try {
    return await decrypt(session)
  } catch (error) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
