import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  // Temporary hardcoded login
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' })
    return NextResponse.json({ token, username })
  }

  return NextResponse.json({ error: 'Invalid login' }, { status: 401 })
}
