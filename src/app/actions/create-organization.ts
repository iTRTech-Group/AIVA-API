'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createOrganizationAction(previousState: any, formData: FormData) {
    const session = await getServerSession(authOptions);

    const token = session?.accessToken;

    if (!token) {
        return { message: 'Não autorizado. Faça login novamente.' };
    }

    const name = formData.get('name') as string;

    if (!name || name.trim().length < 3) {
        return { message: 'O nome da organização deve ter pelo menos 3 caracteres.' };
    }

    try {
        const res = await fetch(`http://localhost:3000/organizations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { message: errorData.message || 'Falha ao criar a organização.' };
        }


        revalidatePath('/organizations');
        return { message: 'Organização criada com sucesso!' };

    } catch (error) {
        console.error("Erro de conexão ao criar organização:", error);
        return { message: 'Erro de conexão.' };
    }
}


