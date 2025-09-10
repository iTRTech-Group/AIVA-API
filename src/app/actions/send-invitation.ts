'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export async function sendInvitationAction(orgId: string, previousState: any, formData: FormData) {
    const session = await getServerSession(authOptions);

    const token = session?.accessToken;

    if (!token) {
        return { message: 'Não autorizado.' };
    }

    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    try {
        const res = await fetch(`${process.env.API_BASE_URL}/organizations/${orgId}/invitations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email, role }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { message: errorData.message || 'Falha ao enviar convite.' };
        }

        return { message: 'Convite enviado com sucesso!' };
    } catch (error) {
        return { message: 'Erro de conexão.' };
    }
}