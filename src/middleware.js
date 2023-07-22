import { NextResponse } from 'next/server'

export function middleware(request) {
    const sessionCookie = request.cookies.get('sessionId');
    const sessionId = sessionCookie !== undefined ? sessionCookie.value : undefined
    if (sessionId === undefined) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
    ],
}