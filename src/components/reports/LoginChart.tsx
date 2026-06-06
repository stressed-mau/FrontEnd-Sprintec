import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import EmptyChart from "./EmptyChart";

type LoginChartProps = {
  loginData: any[];
  hasLoginData: boolean;
  isPrinting: boolean;
  isCompact: boolean;
};

function LoginChart({
  loginData,
  hasLoginData,
  isPrinting,
  isCompact,
}: LoginChartProps) {
  return (
    <div className="bg-white border border-[#A5C9D7] rounded-3xl p-6 shadow-sm break-inside-avoid">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#003A6C]">
          Inicios de sesión por día
        </h2>

        <p className="text-sm text-[#4B778D]">
          Actividad de la última semana
        </p>
      </div>

      {hasLoginData ? (
        <div className="h-44 sm:h-64 print:h-64 w-full print:w-[950px]">
          <ResponsiveContainer
            width={isPrinting ? 900 : "100%"}
            height={isPrinting ? 230 : "100%"}
          >
            <BarChart data={loginData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={isCompact ? 1 : 0}
                minTickGap={isCompact ? 30 : 10}
                tick={{
                  fill: "#4B778D",
                  fontSize: isCompact ? 9 : 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#4B778D",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "#F1F5F9",
                }}
              />

              <Bar
                dataKey="registros"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                barSize={isCompact ? 25 : 60}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart message="Aún no hay inicios de sesión registrados." />
      )}
    </div>
  );
}
export default LoginChart;