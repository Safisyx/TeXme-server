import * as jwt from 'jsonwebtoken'

export const secret = process.env.JWT_SECRET || '9u8nnjksfdt98*(&*safisyx%T$#hsfjk'
const ttl = 3600 * 4 // our JWT tokens are valid for 4 hours

interface JwtPayload {
  id: number,
  role: string
}

export const sign = (data: JwtPayload) =>
  jwt.sign(data, secret, { expiresIn: ttl })

export const verify = (token: string): JwtPayload =>
  jwt.verify(token, secret) as JwtPayload

interface JwtSignup {
  id: number,
  email: string,
}

export const signup = (data: JwtSignup) =>
  jwt.sign(data, secret, { expiresIn: 3600*24 }) //24hours

export const verifySignup = (token: string): JwtSignup =>
  jwt.verify(token, secret) as JwtSignup
