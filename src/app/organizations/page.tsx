import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";
import SendInviteDialog from "@/components/SendInviteDialog";
import InvitationsDialog from "@/components/InvitationsDialog";
import CreateOrgDialog from "@/components/CreateOrgDialog";

type Organization = {
  id: string;
  name: string;
};

const API_URL = process.env.API_BASE_URL;

type Invitation = {
  id: string;
  role: "MEMBER" | "ADMIN";
  organization: { name: string };
};

async function getOrganizations(token: string): Promise<Organization[]> {
  try {
    const response = await fetch(`${API_URL}/organizations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Falha ao buscar organizações");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erro de rede ao buscar organizações:", error);
    return [];
  }
}

async function getInvitations(token: string): Promise<Invitation[]> {
  try {
    const response = await fetch(`${API_URL}/profile/invitations`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar convites:", error);
    return [];
  }
}

export default async function SelectOrgPage() {
  const session = await getServerSession(authOptions);

  const accessToken = session?.accessToken;

  let organizations: Organization[] = [];
  let invitations: Invitation[] = [];

  if (accessToken) {
    [organizations, invitations] = await Promise.all([
      getOrganizations(accessToken),
      getInvitations(accessToken),
    ]);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl flex items-center gap-4">
          Bem-vindo,
          <span className="font-bold">{session?.user?.name || "Usuário"}!</span>
        </h2>
        <div className="flex items-center gap-2">
          <InvitationsDialog invitations={invitations} />
          <LogoutButton />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Selecione uma Organização</h1>
          <CreateOrgDialog />
        </div>
        <p className="mt-2 text-gray-300">
          Escolha uma organização para visualizar ou crie uma nova.
        </p>
      </div>

      {organizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="p-4 bg-dark border rounded-lg flex  justify-between"
            >
              <Link
                href={`/dashboard/${org.id}`}
                className="block text-center flex-grow"
              >
                <h3 className="text-lg font-semibold text-gray-300 hover:text-blue-600 transition-colors">
                  {org.name}
                </h3>
              </Link>
              <SendInviteDialog orgId={org.id} orgName={org.name} />
            </div>
          ))}
          {organizations.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Nenhuma organização encontrada para sua conta.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
