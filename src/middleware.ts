

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    const { pathname } = req.nextUrl;


    const publicPaths = ['/login', '/register'];


    const isPublicPath = publicPaths.includes(pathname);


    if (token) {

        if (isPublicPath) {
            console.log(`Usuário logado em rota pública (${pathname}). Redirecionando para /.`);
            return NextResponse.redirect(new URL('/organizations', req.url));
        }
    }

    else {

        if (!isPublicPath) {
            console.log(`Usuário deslogado em rota privada (${pathname}). Redirecionando para /login.`);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }


    return NextResponse.next();
}



export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};