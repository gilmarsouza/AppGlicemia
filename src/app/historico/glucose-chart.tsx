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
import type { ReadingStatus } from "@/lib/glucose-alerts";
import {
  glucoseContextLabels,
  type GlucoseContext,
} from "@/lib/validations/glucose-reading";

export type ChartPoint = {
  time: number;
  value: number;
  context: GlucoseContext;
  status: ReadingStatus;
};

const DOT_COLORS: Record<ReadingStatus, string> = {
  baixa: "#dc2626",
  normal: "var(--primary)",
  alta: "#d97706",
};

type DotProps = {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
  index?: number;
};

function renderDot(radius: number) {
  function StatusDot({ cx, cy, payload, index }: DotProps) {
    if (cx == null || cy == null || !payload) return <g key={index} />;
    const outOfRange = payload.status !== "normal";
    return (
      <circle
        key={index}
        cx={cx}
        cy={cy}
        r={outOfRange ? radius + 2 : radius}
        fill={outOfRange ? DOT_COLORS[payload.status] : "var(--background)"}
        stroke={DOT_COLORS[payload.status]}
        strokeWidth={2}
      />
    );
  }
  return StatusDot;
}

type TooltipProps = {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
};

function ReadingTooltip({ active, payload }: TooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-base shadow-md">
      <p className="text-lg font-semibold">
        {point.value} mg/dL
        {point.status !== "normal" && (
          <span style={{ color: DOT_COLORS[point.status] }}>
            {" "}
            · {point.status === "baixa" ? "Baixa" : "Alta"}
          </span>
        )}
      </p>
      <p>{glucoseContextLabels[point.context]}</p>
      <p className="text-muted-foreground">{formatDateTime(point.time)}</p>
    </div>
  );
}

// One tick per calendar day: the first reading of each day.
function dayTicks(data: ChartPoint[]) {
  const seen = new Set<string>();
  return data
    .filter((p) => {
      const day = formatShortDate(p.time);
      if (seen.has(day)) return false;
      seen.add(day);
      return true;
    })
    .map((p) => p.time);
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
            ticks={dayTicks(data)}
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
            dot={renderDot(5)}
            activeDot={renderDot(7)}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
