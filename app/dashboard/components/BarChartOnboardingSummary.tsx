"use client";

import {OnboardingStatuses} from "@/app/constants/OnboardingStatuses";
import {ChartConfig, ChartContainer, ChartTooltip} from "@/components/ui/chart";
import {supabase} from "@/lib/supabase";
import {useQuery} from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";

// Define colors for each status - more vibrant pastel colors
const COLORS = [
  "#FF6B81", // Stronger Pink
  "#5DA9E9", // Stronger Blue
  "#66E0E0", // Stronger Turquoise
  "#64B5CD", // Stronger Powder Blue
  "#B288C0", // Stronger Thistle
  "#C774C7", // Stronger Plum
  "#FFAF60", // Stronger Peach
  "#A5A5E1", // Stronger Lavender
  "#66D066", // Stronger Pale Green
  "#FFE066", // Stronger Lemon
];

// Custom tooltip component
const CustomTooltip = ({active, payload}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const statusKey = data.payload.status;
    const statusLabel =
      OnboardingStatuses[statusKey as keyof typeof OnboardingStatuses];

    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold text-base mb-1">{statusLabel}</p>
        <p className="text-base">
          <span className="font-medium">Count:</span> {data.value}
        </p>
      </div>
    );
  }
  return null;
};

export const BarChartOnboardingSummary = () => {
  const {data: onboardingData, isLoading} = useQuery({
    queryKey: ["onboarding-requests"],
    queryFn: async () => supabase.from("onboarding_requests").select(),
  });

  if (isLoading) return <div>Loading onboarding data...</div>;

  // Count the number of requests for each status
  const statusCounts = Object.keys(OnboardingStatuses).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Count occurrences of each status
  onboardingData?.data?.forEach((request) => {
    if (request.status && statusCounts[request.status] !== undefined) {
      statusCounts[request.status]++;
    }
  });

  // Create chart data in the format needed for the bar chart
  const chartData = Object.entries(OnboardingStatuses)
    .map(([key], index) => ({
      status: key,
      count: statusCounts[key],
      fill: COLORS[index % COLORS.length],
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count); // Sort by count in descending order

  // If no data, show a message
  if (chartData.length === 0) {
    return <div>No onboarding data available</div>;
  }

  // Create chart config
  const chartConfig = Object.entries(OnboardingStatuses).reduce(
    (acc, [key, value], index) => ({
      ...acc,
      [key]: {
        label: value,
        color: COLORS[index % COLORS.length],
      },
    }),
    {
      count: {
        label: "Count",
      },
    }
  ) satisfies ChartConfig;

  // Custom styles for the chart
  const labelStyle = {
    fontSize: "15px",
    fontWeight: 500,
    fill: "#333",
  };

  const axisStyle = {
    fontSize: "14px",
    fontWeight: 500,
  };

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <YAxis
            dataKey="status"
            type="category"
            width={180}
            tickLine={false}
            tickMargin={15}
            axisLine={false}
            style={labelStyle}
            tickFormatter={(value) =>
              OnboardingStatuses[value as keyof typeof OnboardingStatuses]
            }
          />
          <XAxis
            dataKey="count"
            type="number"
            tickLine={true}
            axisLine={true}
            style={axisStyle}
          />
          <ChartTooltip
            cursor={{fill: "rgba(0, 0, 0, 0.05)"}}
            content={<CustomTooltip />}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={35}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
