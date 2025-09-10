import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                try {

                    const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });


                    if (!res.ok) {
                        console.error("API de login externa respondeu com erro.");
                        return null;
                    }

                    const responseJSON = await res.json();


                    if (responseJSON) {
                        return { id: responseJSON.user.id, name: responseJSON.user.user_metadata.username, email: responseJSON.user.email, accessToken: responseJSON.session.access_token };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Erro ao chamar a API de login externa:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {

            if (user) {

                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: { session: any; token?: any }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };