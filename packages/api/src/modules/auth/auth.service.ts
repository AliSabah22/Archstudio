import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import type { JWTPayload } from '../../middleware/auth.js'

interface UserRecord {
  id: string
  name: string
  email: string
  role: string
  passwordHash: string
}

// Mock user store — replace with Prisma queries in production
const MOCK_USERS: UserRecord[] = [
  {
    id: 'user_001',
    name: 'Pamir Dogan',
    email: 'pamir@archstudio.ca',
    role: 'principal',
    passwordHash: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // "password"
  },
]

interface TokenPayload {
  sub: string
  role: string
  email: string
}

interface GeneratedTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export const AuthService = {
  async validateCredentials(
    email: string,
    password: string
  ): Promise<Omit<UserRecord, 'passwordHash'> | null> {
    const user = MOCK_USERS.find((u) => u.email === email)
    if (!user) return null
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return null
    const { passwordHash: _, ...safeUser } = user
    return safeUser
  },

  generateTokens(
    user: Omit<UserRecord, 'passwordHash'>,
    app: FastifyInstance
  ): GeneratedTokens {
    const payload: TokenPayload = { sub: user.id, role: user.role, email: user.email }
    const accessToken = app.jwt.sign(payload as unknown as JWTPayload, { expiresIn: '15m' })
    const refreshPayload: JWTPayload = { ...payload, type: 'refresh' }
    const refreshToken = app.jwt.sign(refreshPayload, { expiresIn: '7d' })
    return { accessToken, refreshToken, expiresIn: 900 }
  },

  refreshTokens(
    refreshToken: string,
    app: FastifyInstance
  ): GeneratedTokens {
    const decoded = app.jwt.verify<TokenPayload & { type?: string }>(refreshToken)
    if (decoded.type !== 'refresh') throw new Error('Not a refresh token')
    const user = MOCK_USERS.find((u) => u.id === decoded.sub)
    if (!user) throw new Error('User not found')
    const { passwordHash: _, ...safeUser } = user
    return AuthService.generateTokens(safeUser, app)
  },
}
