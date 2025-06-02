"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
type TrendData = {
  revenue: { date: string; amount: number }[];
  commissions: { date: string; amount: number }[];
};

type TrendChartProps = {
  trend: TrendData;
};

const chartConfig = {
  commissions: {
    label: "คอมมิชชั่น",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "ยอดขาย",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AdminAffiliateTrendChart({ trend }: TrendChartProps) {
  // สร้าง Set รวมวันที่ทั้งหมดจากทั้ง commissions และ revenue
  const allDatesSet = new Set([
    ...trend.commissions.map((item) => item.date),
    ...trend.revenue.map((item) => item.date),
  ]);

  // แปลง Set เป็น Array และเรียงวันที่
  const allDates = Array.from(allDatesSet).sort();

  // สร้าง chartData จากวันที่ทั้งหมด
  const chartData = allDates.map((date) => {
    const commissionItem = trend.commissions.find((c) => c.date === date);
    const revenueItem = trend.revenue.find((r) => r.date === date);

    return {
      date,
      commissions: commissionItem?.amount ?? 0,
      revenue: revenueItem?.amount ?? 0,
    };
  });

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(5)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <Line
          dataKey="commissions"
          type="monotone"
          stroke="var(--color-commissions)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
