import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

let memoryApps: any[] = []

function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = auth.slice(7)
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { username: string }
  return payload.username
}

export async function GET(req: NextRequest) {
  try {
    const username = getUser(req)
    const visible = memoryApps.filter(app => app.user === username || app.isPublic)
    return NextResponse.json(visible)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const username = getUser(req)
    const body = await req.json()
    const id = Math.random().toString(36).substring(2)
    memoryApps.push({ ...body, id, user: username })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const username = getUser(req)
    const body = await req.json()
    const id = req.nextUrl.searchParams.get('id')
    memoryApps = memoryApps.map(app =>
      app.id === id && app.user === username ? { ...app, ...body } : app
    )
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
