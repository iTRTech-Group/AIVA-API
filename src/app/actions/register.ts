
'use server';

import { redirect } from 'next/navigation';


export async function registerUser(previousState: any, formData: FormData) {

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;


    if (!name || !email || !password) {
        return { message: 'Por favor, preencha todos os campos.' };
    }

    try {

        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: name,
                email: email,
                password: password,
            }),
        });


        if (!res.ok) {
            const errorData = await res.json();

            return { message: errorData.message || 'Falha ao registrar. Tente novamente.' };
        }

    } catch (error) {
        console.error(error);
        return { message: 'Não foi possível conectar ao servidor. Tente mais tarde.' };
    }


    redirect('/login');
}