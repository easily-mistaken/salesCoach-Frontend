"use client";

// Helper function to ensure resolved is always less than total by a random percentage
const getResolvedValue = (
  total: number,
  minPercentage = 0.3,
  maxPercentage = 0.9
) => {
  const percentage =
    minPercentage + Math.random() * (maxPercentage - minPercentage);
  return Math.min(total - 1, Math.floor(total * percentage));
};

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for our data structure
type ChartDataItem = {
  date: string;
  total: number;
  resolved: number;
};

type CategoryKey =
  | "all"
  | "price"
  | "timing"
  | "trust"
  | "competition"
  | "stakeholders"
  | "other";

type CategoryDataType = {
  [key in CategoryKey]: ChartDataItem[];
};

// Base chart data
const chartData = [
  { date: "2024-04-01", total: 222, resolved: 150 },
  { date: "2024-04-02", total: 97, resolved: 180 },
  { date: "2024-04-03", total: 167, resolved: 120 },
  { date: "2024-04-04", total: 242, resolved: 260 },
  { date: "2024-04-05", total: 373, resolved: 290 },
  { date: "2024-04-06", total: 301, resolved: 340 },
  { date: "2024-04-07", total: 245, resolved: 180 },
  { date: "2024-04-08", total: 409, resolved: 320 },
  { date: "2024-04-09", total: 59, resolved: 110 },
  { date: "2024-04-10", total: 261, resolved: 190 },
  { date: "2024-04-11", total: 327, resolved: 350 },
  { date: "2024-04-12", total: 292, resolved: 210 },
  { date: "2024-04-13", total: 342, resolved: 380 },
  { date: "2024-04-14", total: 137, resolved: 220 },
  { date: "2024-04-15", total: 120, resolved: 170 },
  { date: "2024-04-16", total: 138, resolved: 190 },
  { date: "2024-04-17", total: 446, resolved: 360 },
  { date: "2024-04-18", total: 364, resolved: 410 },
  { date: "2024-04-19", total: 243, resolved: 180 },
  { date: "2024-04-20", total: 89, resolved: 150 },
  { date: "2024-04-21", total: 137, resolved: 200 },
  { date: "2024-04-22", total: 224, resolved: 170 },
  { date: "2024-04-23", total: 138, resolved: 230 },
  { date: "2024-04-24", total: 387, resolved: 290 },
  { date: "2024-04-25", total: 215, resolved: 250 },
  { date: "2024-04-26", total: 75, resolved: 130 },
  { date: "2024-04-27", total: 383, resolved: 420 },
  { date: "2024-04-28", total: 122, resolved: 180 },
  { date: "2024-04-29", total: 315, resolved: 240 },
  { date: "2024-04-30", total: 454, resolved: 380 },
  { date: "2024-05-01", total: 165, resolved: 220 },
  { date: "2024-05-02", total: 293, resolved: 310 },
  { date: "2024-05-03", total: 247, resolved: 190 },
  { date: "2024-05-04", total: 385, resolved: 420 },
  { date: "2024-05-05", total: 481, resolved: 390 },
  { date: "2024-05-06", total: 498, resolved: 520 },
  { date: "2024-05-07", total: 388, resolved: 300 },
  { date: "2024-05-08", total: 149, resolved: 210 },
  { date: "2024-05-09", total: 227, resolved: 180 },
  { date: "2024-05-10", total: 293, resolved: 330 },
  { date: "2024-05-11", total: 335, resolved: 270 },
  { date: "2024-05-12", total: 197, resolved: 240 },
  { date: "2024-05-13", total: 197, resolved: 160 },
  { date: "2024-05-14", total: 448, resolved: 490 },
  { date: "2024-05-15", total: 473, resolved: 380 },
  { date: "2024-05-16", total: 338, resolved: 400 },
  { date: "2024-05-17", total: 499, resolved: 420 },
  { date: "2024-05-18", total: 315, resolved: 350 },
  { date: "2024-05-19", total: 235, resolved: 180 },
  { date: "2024-05-20", total: 177, resolved: 230 },
  { date: "2024-05-21", total: 82, resolved: 140 },
  { date: "2024-05-22", total: 81, resolved: 120 },
  { date: "2024-05-23", total: 252, resolved: 290 },
  { date: "2024-05-24", total: 294, resolved: 220 },
  { date: "2024-05-25", total: 201, resolved: 250 },
  { date: "2024-05-26", total: 213, resolved: 170 },
  { date: "2024-05-27", total: 420, resolved: 460 },
  { date: "2024-05-28", total: 233, resolved: 190 },
  { date: "2024-05-29", total: 78, resolved: 130 },
  { date: "2024-05-30", total: 340, resolved: 280 },
  { date: "2024-05-31", total: 178, resolved: 230 },
  { date: "2024-06-01", total: 178, resolved: 200 },
  { date: "2024-06-02", total: 470, resolved: 410 },
  { date: "2024-06-03", total: 103, resolved: 160 },
  { date: "2024-06-04", total: 439, resolved: 380 },
  { date: "2024-06-05", total: 88, resolved: 140 },
  { date: "2024-06-06", total: 294, resolved: 250 },
  { date: "2024-06-07", total: 323, resolved: 370 },
  { date: "2024-06-08", total: 385, resolved: 320 },
  { date: "2024-06-09", total: 438, resolved: 480 },
  { date: "2024-06-10", total: 155, resolved: 200 },
  { date: "2024-06-11", total: 92, resolved: 150 },
  { date: "2024-06-12", total: 492, resolved: 420 },
  { date: "2024-06-13", total: 81, resolved: 130 },
  { date: "2024-06-14", total: 426, resolved: 380 },
  { date: "2024-06-15", total: 307, resolved: 350 },
  { date: "2024-06-16", total: 371, resolved: 310 },
  { date: "2024-06-17", total: 475, resolved: 520 },
  { date: "2024-06-18", total: 107, resolved: 170 },
  { date: "2024-06-19", total: 341, resolved: 290 },
  { date: "2024-06-20", total: 408, resolved: 450 },
  { date: "2024-06-21", total: 169, resolved: 210 },
  { date: "2024-06-22", total: 317, resolved: 270 },
  { date: "2024-06-23", total: 480, resolved: 530 },
  { date: "2024-06-24", total: 132, resolved: 180 },
  { date: "2024-06-25", total: 141, resolved: 190 },
  { date: "2024-06-26", total: 434, resolved: 380 },
  { date: "2024-06-27", total: 448, resolved: 490 },
  { date: "2024-06-28", total: 149, resolved: 200 },
  { date: "2024-06-29", total: 103, resolved: 160 },
  { date: "2024-06-30", total: 446, resolved: 400 },
];

// Create category-specific mock data with distinct patterns
const createCategoryData = () => {
  // Price objections: High volume, seasonal pattern with peaks in mid-month
  const price = chartData.map((item) => {
    const date = new Date(item.date);
    const dayOfMonth = date.getDate();
    // Create a mid-month peak pattern
    const multiplier = dayOfMonth > 10 && dayOfMonth < 20 ? 0.5 : 0.3;
    // Add seasonal variation with higher numbers in May
    const monthFactor = date.getMonth() === 4 ? 1.3 : 1;
    const total = Math.floor(item.total * multiplier * monthFactor * 0.5);
    return {
      date: item.date,
      total: total,
      resolved: getResolvedValue(total, 0.55, 0.75),
    };
  });

  // Timing objections: Spiky pattern with specific peaks
  const timing = chartData.map((item) => {
    const date = new Date(item.date);
    const dayOfMonth = date.getDate();
    const isSpike = dayOfMonth % 10 <= 2;
    const multiplier = isSpike ? 0.45 : 0.15;
    const total = Math.floor(item.total * multiplier * 0.5);
    return {
      date: item.date,
      total: total,
      resolved: getResolvedValue(total, 0.6, 0.85),
    };
  });

  // Trust/Risk objections: Steady but concerning trend with increasing numbers
  const trust = chartData.map((item, index) => {
    const date = new Date(item.date);
    const monthIndex = date.getMonth() - 3; // Starting from April (0) to June (2)
    const trendFactor = 0.15 + monthIndex * 0.05;
    const total = Math.floor(item.total * trendFactor * 0.5);

    // Decreasing resolution rate over time showing worsening situation
    const dayProgress = index / chartData.length; // 0 to 1 over the period
    const maxResolution = 0.65 - dayProgress * 0.2;

    return {
      date: item.date,
      total: total,
      resolved: getResolvedValue(total, 0.35, maxResolution),
    };
  });

  // Competition objections: Cyclical with weekly pattern
  const competition = chartData.map((item) => {
    const date = new Date(item.date);
    const dayOfWeek = date.getDay();
    // Higher on weekdays (Mon-Fri), lower on weekends
    const multiplier = dayOfWeek > 0 && dayOfWeek < 6 ? 0.25 : 0.1;
    const total = Math.floor(item.total * multiplier * 0.5);

    // Better resolution earlier in the week
    const minResolution = dayOfWeek <= 3 ? 0.6 : 0.5;
    const maxResolution = dayOfWeek <= 3 ? 0.8 : 0.7;

    return {
      date: item.date,
      total: total,
      resolved: getResolvedValue(total, minResolution, maxResolution),
    };
  });

  // Stakeholder objections: Low volume but with specific event-based spikes
  const stakeholders = chartData.map((item) => {
    const date = new Date(item.date);
    const dayOfMonth = date.getDate();
    const monthIndex = date.getMonth();

    // Specific events (meetings, quarter-end, etc.)
    const isQuarterEnd = monthIndex === 5 && dayOfMonth >= 25; // End of Q2 (June)
    const isMonthEnd = dayOfMonth >= 28;
    const isMonthStart = dayOfMonth <= 3;

    let multiplier = 0.08; // Base rate
    if (isQuarterEnd) multiplier = 0.3;
    else if (isMonthEnd) multiplier = 0.2;
    else if (isMonthStart) multiplier = 0.15;

    const total = Math.floor(item.total * multiplier * 0.5);

    // Lower resolution during busy periods
    let minResolution = 0.4;
    let maxResolution = 0.6;
    if (isQuarterEnd) {
      minResolution = 0.3;
      maxResolution = 0.5;
    } else if (isMonthEnd) {
      minResolution = 0.35;
      maxResolution = 0.55;
    }

    return {
      date: item.date,
      total: total,
      resolved: getResolvedValue(total, minResolution, maxResolution),
    };
  });

  // Other objections: Random pattern with gradual improvement in resolution rate
  const other = chartData.map((item, index) => {
    const randomFactor = 0.15 + Math.random() * 0.1;
    const total = Math.floor(item.total * randomFactor * 0.5);

    // Gradually improving resolution rate
    const dayProgress = index / chartData.length; // 0 to 1 over the entire period
    const minResolution = 0.3 + dayProgress * 0.2;
    const maxResolution = 0.5 + dayProgress * 0.25;

    return {
      date: item.date,
      total: total,
      resolved: getResolvedValue(total, minResolution, maxResolution),
    };
  });

  // Now create the "all" category by summing all other categories
  const all = chartData.map((item, index) => {
    const sumTotal =
      price[index].total +
      timing[index].total +
      trust[index].total +
      competition[index].total +
      stakeholders[index].total +
      other[index].total;

    const sumResolved =
      price[index].resolved +
      timing[index].resolved +
      trust[index].resolved +
      competition[index].resolved +
      stakeholders[index].resolved +
      other[index].resolved;

    return {
      date: item.date,
      total: sumTotal,
      resolved: sumResolved,
    };
  });

  return {
    all,
    price,
    timing,
    trust,
    competition,
    stakeholders,
    other,
  };
};

const categoryData: CategoryDataType = createCategoryData();

const chartConfig = {
  objectionss: {
    label: "Objections",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Category label mapping
const categoryLabels: Record<CategoryKey, string> = {
  all: "All Categories",
  price: "Price",
  timing: "Timing",
  trust: "Trust/Risk",
  competition: "Competition",
  stakeholders: "Stakeholders",
  other: "Other",
};

export function ObjectionChart() {
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d");
  const [category, setCategory] = React.useState<CategoryKey>("all");

  // Filter data based on selected time range
  const filterByTimeRange = (data: ChartDataItem[]): ChartDataItem[] => {
    return data.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date("2024-06-30");
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  };

  // Get data filtered by both category and time range
  const filteredData = filterByTimeRange(categoryData[category]);

  // Update description text based on selections
  const getDescription = () => {
    let timeDescription = "the last 3 months";
    if (timeRange === "30d") timeDescription = "the last 30 days";
    if (timeRange === "7d") timeDescription = "the last 7 days";

    return `Showing ${
      category === "all" ? "all" : categoryLabels[category]
    } objections for ${timeDescription}`;
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Objection Trends Over Time</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={category}
            onValueChange={(value: string) => setCategory(value as CategoryKey)}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select a category"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All Categories
              </SelectItem>
              <SelectItem value="price" className="rounded-lg">
                Price
              </SelectItem>
              <SelectItem value="timing" className="rounded-lg">
                Timing
              </SelectItem>
              <SelectItem value="trust" className="rounded-lg">
                Trust/Risk
              </SelectItem>
              <SelectItem value="competition" className="rounded-lg">
                Competition
              </SelectItem>
              <SelectItem value="stakeholders" className="rounded-lg">
                Stakeholders
              </SelectItem>
              <SelectItem value="other" className="rounded-lg">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={timeRange}
            onValueChange={(value: string) =>
              setTimeRange(value as "90d" | "30d" | "7d")
            }
          >
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillresolved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-resolved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-resolved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="resolved"
              type="natural"
              fill="url(#fillresolved)"
              stroke="var(--color-resolved)"
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-total)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
