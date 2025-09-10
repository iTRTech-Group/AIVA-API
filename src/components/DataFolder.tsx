import { ChevronRight } from "lucide-react";

interface DataFolderProps {
  title: string;
  total: string;
  children: React.ReactNode;
}

export default function DataFolder({
  title,
  total,
  children,
}: DataFolderProps) {
  return (
    <details className="data-folder bg-dark rounded-xl border border-gray-300 overflow-hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
        <div className="flex items-center gap-4">
          <ChevronRight size={20} className="text-gray-400 arrow-icon" />
          <h3 className="text-xl font-bold text-gray-300">{title}</h3>
        </div>
        <span className="text-sm font-semibold text-white bg-blue-500 px-3 py-1 rounded-full">
          {total}
        </span>
      </summary>
      <div className="details-content p-4 border-t border-gray-200 bg-gray-700">
        {children}
      </div>
    </details>
  );
}
