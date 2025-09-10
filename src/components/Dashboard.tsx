"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import DataFolder from "@/components/DataFolder";
import { Clock, Users, Briefcase, Calendar, FolderKanban } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

const formatMinutesToHours = (minutes: number): string => {
  if (isNaN(minutes) || minutes === 0) return "0h 00m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
};

const parseDate = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== "string") return null;
  const parts = dateString.split("/");
  if (parts.length !== 3) return null;
  return new Date(
    parseInt(parts[2]),
    parseInt(parts[1]) - 1,
    parseInt(parts[0])
  );
};

const RenderContent = ({
  entries,
  filter,
}: {
  entries: TimesheetEntry[];
  filter: string;
}) => {
  if (filter === "advogados") {
    const grouped = entries.reduce((acc, entry) => {
      const key = entry.Nome || "Não Identificado";
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {} as Record<string, TimesheetEntry[]>);

    return (
      <div className="space-y-3 bg-dark">
        {Object.entries(grouped).map(([advogado, advogadoEntries]) => {
          const totalMinutes = advogadoEntries.reduce(
            (sum, e) => sum + e.Minutos,
            0
          );
          return (
            <DataFolder
              key={advogado}
              title={advogado}
              total={formatMinutesToHours(totalMinutes)}
            >
              <ul>
                {advogadoEntries.map((entry) => (
                  <li key={entry.id} className="mb-1">
                    <strong>
                      {entry.Data} - {entry.Projeto}:
                    </strong>
                    {entry.Rubrica && (
                      <span className="ml-2 bg-blue-900 text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                        Rubrica: {entry.Rubrica}
                      </span>
                    )}
                    {entry.Area && (
                      <span className="ml-2 bg-purple-900 text-purple-300 text-xs font-medium px-2 py-0.5 rounded">
                        Área: {entry.Area}
                      </span>
                    )}
                    {entry.Descrição} ({entry.Minutos} min)
                  </li>
                ))}
              </ul>
            </DataFolder>
          );
        })}
      </div>
    );
  }

  if (filter === "clientes") {
    const grouped = entries.reduce((acc, entry) => {
      const key = entry.Cliente || "Não Especificado";
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {} as Record<string, TimesheetEntry[]>);

    return (
      <div className="space-y-3">
        {Object.entries(grouped).map(([cliente, clienteEntries]) => {
          const totalMinutes = clienteEntries.reduce(
            (sum, e) => sum + e.Minutos,
            0
          );
          return (
            <DataFolder
              key={cliente}
              title={cliente}
              total={formatMinutesToHours(totalMinutes)}
            >
              <ul>
                {clienteEntries.map((entry) => (
                  <li key={entry.id} className="mb-1 text-gray-400">
                    <strong className="text-gray-300">
                      {entry.Data} - {entry.Nome} ({entry.Projeto}):
                    </strong>
                    {entry.Rubrica && (
                      <span className="ml-2 bg-blue-900 text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                        Rubrica: {entry.Rubrica}
                      </span>
                    )}
                    {entry.Area && (
                      <span className="ml-2 bg-purple-900 text-purple-300 text-xs font-medium px-2 py-0.5 rounded">
                        Área: {entry.Area}
                      </span>
                    )}
                    {entry.Descrição} ({entry.Minutos} min)
                  </li>
                ))}
              </ul>
            </DataFolder>
          );
        })}
      </div>
    );
  }

  if (filter === "registros") {
    const grouped = entries.reduce((acc, entry) => {
      const key = entry.Data || "Sem Data";
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {} as Record<string, TimesheetEntry[]>);

    const sortedDates = Object.entries(grouped).sort(([dateA], [dateB]) => {
      return (
        (parseDate(dateB)?.getTime() || 0) - (parseDate(dateA)?.getTime() || 0)
      );
    });

    return (
      <div className="space-y-3 ">
        {sortedDates.map(([data, dataEntries]) => {
          const totalMinutes = dataEntries.reduce(
            (sum, e) => sum + e.Minutos,
            0
          );
          return (
            <DataFolder
              key={data}
              title={`Dia: ${data}`}
              total={formatMinutesToHours(totalMinutes)}
            >
              <ul>
                {dataEntries.map((entry) => (
                  <li key={entry.id} className="mb-1">
                    <strong>
                      {entry.Nome} - {entry.Projeto}:
                    </strong>
                    {entry.Rubrica && (
                      <span className="ml-2 bg-blue-900 text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                        Rubrica: {entry.Rubrica}
                      </span>
                    )}
                    {entry.Area && (
                      <span className="ml-2 bg-purple-900 text-purple-300 text-xs font-medium px-2 py-0.5 rounded">
                        Área: {entry.Area}
                      </span>
                    )}
                    {entry.Descrição} ({entry.Minutos} min)
                  </li>
                ))}
              </ul>
            </DataFolder>
          );
        })}
      </div>
    );
  }

  if (filter === "projetos") {
    const grouped = entries.reduce((acc, entry) => {
      const key = entry.Projeto || "Não Especificado";
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {} as Record<string, TimesheetEntry[]>);

    return (
      <div className="space-y-3">
        {Object.entries(grouped).map(([projeto, projetoEntries]) => {
          const totalMinutes = projetoEntries.reduce(
            (sum, e) => sum + e.Minutos,
            0
          );
          return (
            <DataFolder
              key={projeto}
              title={projeto}
              total={formatMinutesToHours(totalMinutes)}
            >
              <ul>
                {projetoEntries.map((entry) => (
                  <li key={entry.id} className="mb-1 text-gray-400">
                    <strong className="text-gray-300">
                      {entry.Data} - {entry.Nome} ({entry.Cliente}):
                    </strong>
                    {entry.Rubrica && (
                      <span className="ml-2 bg-blue-900 text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                        Rubrica: {entry.Rubrica}
                      </span>
                    )}
                    {entry.Area && (
                      <span className="ml-2 bg-purple-900 text-purple-300 text-xs font-medium px-2 py-0.5 rounded">
                        Área: {entry.Area}
                      </span>
                    )}
                    {entry.Descrição} ({entry.Minutos} min)
                  </li>
                ))}
              </ul>
            </DataFolder>
          );
        })}
      </div>
    );
  }

  return null;
};

interface DashboardProps {
  initialEntries: TimesheetEntry[];
}

export default function Dashboard({ initialEntries }: DashboardProps) {
  const { data: session } = useSession();
  const [allEntries, setAllEntries] = useState(initialEntries);
  const [filteredEntries, setFilteredEntries] = useState(initialEntries);

  const [activeFilter, setActiveFilter] = useState<
    "advogados" | "clientes" | "projetos" | "registros"
  >("advogados");

  const stats = useMemo(() => {
    const totalMinutos = filteredEntries.reduce(
      (sum, entry) => sum + (entry.Minutos || 0),
      0
    );
    const totalAdvogados = new Set(filteredEntries.map((e) => e.Nome)).size;
    const totalClientes = new Set(filteredEntries.map((e) => e.Cliente)).size;
    const totalProjetos = new Set(filteredEntries.map((e) => e.Projeto)).size;
    const totalRegistros = filteredEntries.length;
    return {
      totalMinutos,
      totalAdvogados,
      totalClientes,
      totalProjetos,
      totalRegistros,
    };
  }, [filteredEntries]);

  const handleFilter = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) {
      return;
    }

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);

    const filtered = allEntries.filter((entry) => {
      const entryDate = parseDate(entry.Data);
      return entryDate && entryDate >= start && entryDate <= end;
    });

    setFilteredEntries(filtered);
  };

  const handleClearFilter = () => {
    setFilteredEntries(allEntries);

    (document.getElementById("startDate") as HTMLInputElement).value = "";
    (document.getElementById("endDate") as HTMLInputElement).value = "";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">
          Bem-vindo,{" "}
          <span className="font-bold">{session?.user?.name || "Usuário"}</span>!
        </h2>
        <Link
          href={"/organizations"}
          className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Voltar
        </Link>
      </div>

      <Header onFilter={handleFilter} onClear={handleClearFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Tempo Total"
          value={stats.totalMinutos + " min"}
          subValue={formatMinutesToHours(stats.totalMinutos)}
          icon={<Clock size={24} />}
          isActive={false}
          onClick={() => {}}
          isClickable={false}
        />
        <StatCard
          title="Advogados"
          value={stats.totalAdvogados}
          icon={<Users size={24} />}
          isActive={activeFilter === "advogados"}
          onClick={() => setActiveFilter("advogados")}
        />
        <StatCard
          title="Clientes"
          value={stats.totalClientes}
          icon={<Briefcase size={24} />}
          isActive={activeFilter === "clientes"}
          onClick={() => setActiveFilter("clientes")}
        />
        <StatCard
          title="Áreas"
          value={stats.totalProjetos}
          icon={<FolderKanban size={24} />}
          isActive={activeFilter === "projetos"}
          onClick={() => setActiveFilter("projetos")}
        />
        <StatCard
          title="Registros"
          value={stats.totalRegistros}
          icon={<Calendar size={24} />}
          isActive={activeFilter === "registros"}
          onClick={() => setActiveFilter("registros")}
        />
      </div>

      <main className="bg-dark p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-00 mb-4">
          Registros por{" "}
          {activeFilter === "registros"
            ? "Data"
            : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
        </h2>

        <RenderContent entries={filteredEntries} filter={activeFilter} />
      </main>
    </div>
  );
}
