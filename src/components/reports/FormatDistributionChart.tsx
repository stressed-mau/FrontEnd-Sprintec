import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

import EmptyChart from "./EmptyChart";
import { renderCustomizedLabel } from "./CustomPieLabel";

const COLORS = ["#36A2EB", "#FFCE56", "#FF334B", "#4BC0C0"];

export default function FormatDistributionChart({
  data,
  isCompact,
  hasData,
}: any) {
  if (!hasData) {
    return <EmptyChart message="Aún no hay formatos registrados." />;
  }

  return (
    <div>
      <div className={`${isCompact ? "h-52" : "h-64"} print:hidden`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              outerRadius={isCompact ? 65 : 90}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {data.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* PRINT */}
      <div className="hidden print:block mx-auto w-[450px] h-[320px]">
        <PieChart width={450} height={320}>
          <Pie data={data} outerRadius={90} dataKey="value">
            {data.map((_: any, i: number) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}