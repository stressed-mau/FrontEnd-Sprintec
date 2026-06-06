import { api } from "@/services/api";

export interface ChartData {
  name: string;
  registros: number;
}

export interface User {
  name: string;
  email: string;
  job: string;
  date: string;
  last: string;
}

export interface Stats {
  totalUsers: number;
  newUsers: number;
  totalVisitors: number;
}

export interface ResponseData {
  stats: Stats;
  dailyData: ChartData[];
  weeklyData: ChartData[];
  monthlyData: ChartData[];
  yearlyData: ChartData[];
  loginData: ChartData[];
  users: User[];
}

const transformChartData = (
  labels: string[],
  totals: number[],
  range?: "day" | "week" | "month" | "year"
): ChartData[] => {
  return labels.map((label, index) => ({
    name:
      range === "day"
        ? label.split(" ")[1] || label
        : label,
    registros: totals[index],
  }));
};

export const getUserReports = async (
  range: "day" | "week" | "month" | "year" = "month"
): Promise<ResponseData> => {

  const response = await api.get(
    `/admin/report?range=${range}`
  );

  const backendData = response.data.data;

  return {
    stats: {
      totalUsers: backendData.total_users.total,
      newUsers: backendData.new_users_this_month.total,
      totalVisitors: backendData.total_visitors.total,
    },

    dailyData:
      backendData.registered_users.range === "day"
        ? transformChartData(
            backendData.registered_users.labels,
            backendData.registered_users.totals,
            "day"
          )
        : [],

    weeklyData:
      backendData.registered_users.range === "week"
        ? transformChartData(
            backendData.registered_users.labels,
            backendData.registered_users.totals,
            "week"
          )
        : [],

    monthlyData:
      backendData.registered_users.range === "month"
        ? transformChartData(
            backendData.registered_users.labels,
            backendData.registered_users.totals,
            "month"
          )
        : [],

    yearlyData:
      backendData.registered_users.range === "year"
        ? transformChartData(
            backendData.registered_users.labels,
            backendData.registered_users.totals,
            "year"
          )
        : [],

    loginData: transformChartData(
      backendData.logins_by_day.labels,
      backendData.logins_by_day.totals
    ),

    users: backendData.users_table.users.map((user: any) => ({
      name: user.fullname,
      email: user.email,
      job: user.occupation,
      date: user.created_at,
      last: user.last_login_at,
    })),
  };
};