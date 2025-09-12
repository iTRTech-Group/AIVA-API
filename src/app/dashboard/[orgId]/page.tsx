import Dashboard from "@/components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const API_URL = process.env.API_BASE_URL;

type ResultDataItem = {
  cliente: string | null;
  projeto: string;
  minutos: number | null;
  descricao: string;
  rubrica?: string;
  area?: string;
};

type ApiEntry = {
  id: string;
  executed_at: string;
  result_data: ResultDataItem | ResultDataItem[];
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
  // Usamos flatMap para "achatar" a estrutura. Para cada item da API,
  // ele pode retornar um ou mais TimesheetEntry.

  return apiData.flatMap((item) => {
    const date = new Date(item.executed_at);
    const formattedDate = date.toLocaleString("pt-BR", {});

    // Garante que result_data não é nulo ou indefinido
    const results = item.result_data;
    if (!results) {
      return []; // Retorna um array vazio para este item se não houver dados
    }

    // Verificamos se result_data é um array
    if (Array.isArray(results)) {
      // Se for um array, mapeamos cada sub-item para um TimesheetEntry completo
      return results.map((entry, index) => ({
        // Geramos um ID único para cada item do array, como você sugeriu
        id: `${item.id}_${index}`,
        Nome: item.executor_username,
        Data: formattedDate,
        // Dados do sub-item
        Cliente: entry.cliente || "Não especificado",
        Projeto: entry.projeto,
        Minutos: entry.minutos || 0, // Garante que minutos seja um número
        Descrição: entry.descricao,
        Rubrica: entry.rubrica,
        Area: entry.area,
      }));
    } else {
      // Se não for um array, lidamos com o formato antigo (objeto único)
      return [
        {
          id: item.id,
          Nome: item.executor_username,
          Data: formattedDate,
          Cliente: results.cliente || "Não especificado",
          Projeto: results.projeto,
          Minutos: results.minutos || 0,
          Descrição: results.descricao,
          Rubrica: results.rubrica,
          Area: results.area,
        },
      ];
    }
  });
  // Adicionamos um filtro final para remover entradas que não são úteis
  // (como a de "Descanso" que tinha minutos nulos)
  //.filter((entry) => entry.Minutos > 0)
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
