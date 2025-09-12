

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as any;


    if (token) {

        const isExpired = Date.now() / 1000 > token.exp;

        if (isExpired) {
            console.log(`Token expirado em ${new Date(token.exp * 1000)}. Redirecionando para login.`);

            // Se o token está expirado, forçamos o redirecionamento para o login.
            // Criamos uma URL de login e invalidamos o cookie do token para limpar a sessão.
            const loginUrl = new URL('/login', req.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('next-auth.session-token'); // Limpa o cookie principal
            response.cookies.delete('next-auth.csrf-token'); // Limpa o cookie de CSRF

            return response;
        }
    }

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