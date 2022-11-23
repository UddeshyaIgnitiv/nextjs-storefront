import { NextResponse, NextRequest } from 'next/server'

const checkIsAutheticated = (req: NextRequest) => {
  const cookie = req.headers.get('cookie')
  const cookieValue = cookie?.split('kibo_at=')[1]
  const decodedCookie = JSON.parse(atob(cookieValue as string))
  return decodedCookie?.userId
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/my-account-sushant')) {
    if (!checkIsAutheticated(request)) {
      return NextResponse.redirect('/')
    }
  }
}