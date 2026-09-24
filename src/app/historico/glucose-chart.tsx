"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDateTime, formatShortDate } from "@/lib/format";
import {
  glucoseContextLabels,
  type GlucoseContext,
} from "@/lib/validations/glucose-reading";

export type ChartPoint = {
  time: number;
  value: number;
  context: GlucoseContext;
};

type TooltipProps = {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
};

function ReadingTooltip({ active, payload }: TooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-base shadow-md">
      <p className="text-lg font-semibold">{point.value} mg/dL</p>
      <p>{glucoseContextLabels[point.context]}</p>
      <p className="text-muted-foreground">{formatDateTime(point.time)}</p>
    </div>
  );
}

export function GlucoseChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value: number) => formatShortDate(value)}
            tick={{ fontSize: 14 }}
            minTickGap={24}
          />
          <YAxis
            width={48}
            tick={{ fontSize: 14 }}
            domain={[
              (dataMin: number) => Math.max(0, Math.floor((dataMin - 20) / 10) * 10),
              (dataMax: number) => Math.ceil((dataMax + 20) / 10) * 10,
            ]}
          />
          <Tooltip content={<ReadingTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
