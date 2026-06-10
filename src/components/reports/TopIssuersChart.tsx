import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import EmptyChart from "./EmptyChart";

interface Props {
  data: any[];
  isCompact: boolean;
  isMobile: boolean;
  hasData: boolean;
}

export default function TopIssuersChart({
  data,
  isCompact,
  isMobile,
  hasData,
}: Props) {
  if (!hasData) {
    return <EmptyChart message="Aún no hay emisores registrados." />;
  }

  return (
  <>
    <div
      className="w-full print:hidden"
      style={{
        height: `${Math.max(data.length * (isCompact ? 45 : 60), 250)}px`,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={isCompact ? 70 : 110}
            tick={{ fontSize: isMobile ? 9 : 12 }}
          />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#4A6CF7" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Vista impresión */}
    <div className="hidden print:block mx-auto">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 85,
          left: 20,
          bottom: 5,
        }}
        width={900}
        height={Math.max(data.length * 50, 250)}
      >
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
        />
        <Bar dataKey="cantidad" fill="#4A6CF7" />
      </BarChart>
    </div>
  </>
  );
}