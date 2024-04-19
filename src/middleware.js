import { NextResponse } from 'next/server'

// ensureSuperTokensInit();

export async function middleware(request) {
    // NOTE: Secure API route via middleware. Must be paired with:
    // export const config = {
    //     matcher: '/api/:path*',
    //   }
    // however we can just add guards on each API route, for now I prefer that approach as some APIs will be open.

    // if (request.headers.has("x-user-id")) {
    //     console.warn("The FE tried to pass x-user-id, which is only supposed to be a backend internal header. Ignoring.");
    //     request.headers.delete("x-user-id");
    // }

    // if (request.nextUrl.pathname.startsWith('/api/auth')) {
    //     /**
    //      * /api/auth/* endpoints are exposed by the SuperTokens SDK, 
    //      * we do not want to modify the request for these routes
    //      */
    //     return NextResponse.next()
    // }

    // return withSession(request, async (err, session) => {
    //     if (err) {
    //         return NextResponse.json(err, { status: 500 });
    //     }
    //     if (session === undefined) {
    //         return NextResponse.next()
    //     }
    //     return NextResponse.next({
    //         headers: {
    //             // You cannot attach the full session object here
    //             'x-user-id': session.getUserId(),
    //         },
    //     })
    // })
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}