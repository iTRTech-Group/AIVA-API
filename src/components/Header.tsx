"use client";

interface HeaderProps {
  onFilter: (startDate: string, endDate: string) => void;
  onClear: () => void;
}

export default function Header({ onFilter, onClear }: HeaderProps) {
  const handleFilterClick = () => {
    const startDate = (document.getElementById("startDate") as HTMLInputElement)
      .value;
    const endDate = (document.getElementById("endDate") as HTMLInputElement)
      .value;
    onFilter(startDate, endDate);
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Timesheets</h1>
        <p className="text-lg text-gray-300 mt-1">Resumo de horas da equipe</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <input
          type="date"
          id="startDate"
          className="bg-dark border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        <span className="text-gray-300">até</span>
        <input
          type="date"
          id="endDate"
          className="bg-dark border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        <button
          onClick={handleFilterClick}
          className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Filtrar
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
        >
          Limpar
        </button>
      </div>
    </header>
  );
}
