'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";



export async function acceptInvitationAction(invitationId: string) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
        return;
    }



    try {
        const response = await fetch(`http://localhost:3000/profile/invitations/${invitationId}/accept`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Falha ao aceitar convite");
            return;
        }

        revalidatePath('/organizations');

    } catch (error) {
        console.error("Falha ao aceitar convite:", error);
    }
}