import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

import EmptyChart from "./EmptyChart";
import { renderCustomizedLabel } from "./CustomPieLabel";

const COLORS = ["#FF9F40", "#51db86"];

export default function ExpirationChart({
  data,
  isCompact,
  hasData,
}: any) {
  if (!hasData) {
    return <EmptyChart message="No hay datos de vencimiento." />;
  }

  return (
    <div>
      <div className="h-72 print:hidden">
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
      <div className="hidden print:block w-[350px] h-[320px] mx-auto">
        <PieChart width={350} height={320}>
          <Pie data={data} outerRadius={90} cx={175} cy={160} dataKey="value">
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