import Dashboard from "@/components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const API_URL = process.env.API_BASE_URL;

type ApiEntry = {
  id: string;
  status: string;
  tokens_spent: number;
  executed_at: string;
  result_data: {
    cliente: string;
    projeto: string;
    minutos: number;
    descricao: string;
    rubrica?: string;
    area?: string;
  };
  executor_username: string;
};

type TimesheetEntry = {
  id: string;
  Nome: string;
  Cliente: string;
  Projeto: string;
  Data: string;
  Minutos: number;
  Descrição: string;
  Rubrica?: string;
  Area?: string;
};

function mapApiDataToTimesheetEntries(apiData: ApiEntry[]): TimesheetEntry[] {
  return apiData
    .filter((item) => item.status === "SUCCESS" && item.result_data)
    .map((item) => {
      const date = new Date(item.executed_at);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return {
        id: item.id,
        Nome: item.executor_username,
        Cliente: item.result_data.cliente,
        Projeto: item.result_data.projeto,
        Data: formattedDate,
        Minutos: item.result_data.minutos,
        Descrição: item.result_data.descricao,
        Rubrica: item.result_data.rubrica,
        Area: item.result_data.area,
      };
    });
}

async function getTimesheetData(token: string, ordId: string) {
  try {
    const response = await fetch(
      `${API_URL}/organizations/${ordId}/executions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao buscar dados do timesheet.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const myParams = await params;
  let apiData: ApiEntry[] = [];
  const session = await getServerSession(authOptions);

  const accessToken = session?.accessToken;

  if (accessToken) {
    apiData = await getTimesheetData(accessToken, myParams.orgId);
  } else {
    console.log("Nenhum token encontrado na sessão do servidor.");
  }

  const initialEntries = mapApiDataToTimesheetEntries(apiData);

  return <Dashboard initialEntries={initialEntries} />;
}
