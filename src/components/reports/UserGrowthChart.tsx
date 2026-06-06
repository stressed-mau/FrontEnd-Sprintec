import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import EmptyChart from "./EmptyChart";

type Period = "Día" | "Semana" | "Mes" | "Año";

type UserGrowthChartProps = {
  selectedPeriod: Period;
  growthData: any[];
  hasGrowthData: boolean;
  isPrinting: boolean;
  isCompact: boolean;
  onPeriodChange: (period: Period) => void;
};

function UserGrowthChart({
  selectedPeriod,
  growthData,
  hasGrowthData,
  isPrinting,
  isCompact,
  onPeriodChange,
}: UserGrowthChartProps) {
  const periods: Period[] = [
    "Día",
    "Semana",
    "Mes",
    "Año",
  ];

  const descriptionMap = {
    Día: "Registros por hora (últimas 24 horas)",
    Semana: "Registros por día (últimos 7 días)",
    Mes: "Registros por semana (último mes)",
    Año: "Registros por mes (últimos 12 meses)",
  };

  return (
    <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#003A6C]">
          Crecimiento temporal
        </h2>

        <p className="text-sm text-[#4B778D]">
          {descriptionMap[selectedPeriod]}
        </p>
      </div>

      {hasGrowthData ? (
        <div className="h-48 sm:h-64 w-full overflow-hidden print:h-64 print:w-[950px]">
          <ResponsiveContainer
            width={isPrinting ? 900 : "99%"}
            height={isPrinting ? 230 : "100%"}
            debounce={0}
          >
            <LineChart
              data={growthData}
              margin={{
                top: isPrinting ? 5 : 10,
                right: 20,
                left: 10,
                bottom: isPrinting ? 5 : 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={isCompact ? 2 : 0}
                minTickGap={isCompact ? 40 : 20}
                tickMargin={8}
                padding={{ left: 20, right: 20 }}
                tick={{
                  fill: "#4B778D",
                  fontSize: 11,
                }}
              />

              <YAxis
                width={35}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#4B778D",
                  fontSize: 12,
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="registros"
                stroke="#22C55E"
                strokeWidth={3}
                isAnimationActive={false}
                dot={{
                  r: isCompact ? 3 : 6,
                  fill: "#22C55E",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: isCompact ? 5 : 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart message="Aún no hay registros para el período seleccionado." />
      )}

      <div className="flex justify-center mt-6 print:hidden">
        <div className="flex flex-wrap justify-center gap-2 bg-[#D1E3EB] p-2 rounded-xl">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? "bg-[#003A6C] text-white"
                  : "text-[#4B778D] hover:bg-[#B8D4E0]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default UserGrowthChart;