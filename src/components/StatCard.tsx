"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  isClickable?: boolean;
}

export default function StatCard({
  title,
  value,
  subValue,
  icon,
  isActive,
  onClick,
  isClickable = true,
}: StatCardProps) {
  const baseClasses = "bg-dark p-5 rounded-xl border border-gray-200 shadow-sm";
  const clickableClasses = isClickable
    ? "cursor-pointer transition hover:border-blue-400"
    : "";
  const activeClasses = isActive ? "active-filter" : "";

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`${baseClasses} ${clickableClasses} ${activeClasses}`}
    >
      <div className="flex justify-between items-center text-gray-300">
        <span>{title}</span>
        {icon}
      </div>
      <p className="text-4xl font-bold mt-2">{value}</p>

      {subValue && <p className="text-sm text-gray-300 mt-1">{subValue}</p>}
    </div>
  );
}
