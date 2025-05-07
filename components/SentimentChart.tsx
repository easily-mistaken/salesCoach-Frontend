"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Simplified interface - only what we need
interface SentimentChartProps {
  data: {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  // Simple null check
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="w-full h-80">
      {" "}
      {/* Fixed height container */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, ""]}
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />
          <Legend />

          <Line
            type="monotone"
            dataKey="positive"
            stroke="#10B981" // Green
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Positive"
          />
          <Line
            type="monotone"
            dataKey="neutral"
            stroke="#60A5FA" // Blue
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Neutral"
          />
          <Line
            type="monotone"
            dataKey="negative"
            stroke="#EF4444" // Red
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Negative"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
