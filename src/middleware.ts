import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware'

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/sgin-in',
        '/sign-up',
        '/',
        '/verify/:path*'
        
    ]
}


export async function middleware(request: NextRequest) {
    const Token = await getToken({ req: request });
    const url = request.nextUrl;


    // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if(Token && (
        url.pathname.startsWith('/sgin-in') ||
        url.pathname.startsWith('/sgin-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/' )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!Token && url.pathname.startsWith('/dashboard') ){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    
 return NextResponse.next();
}

