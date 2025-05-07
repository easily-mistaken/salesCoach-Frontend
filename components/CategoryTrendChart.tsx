"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetObjectionCategoriesTrend } from "@/services/dashboard/query";

// Define colors for the categories
const categoryColors = {
  price: "#ff6384",
  timing: "#36a2eb",
  trust: "#ffce56",
  competition: "#4bc0c0",
  stakeholders: "#9966ff",
  other: "#ff9f40",
};

interface CategoryTrendChartProps {
  organizationId: string;
  startDate?: string;
  endDate?: string;
}

export function CategoryTrendChart({
  organizationId,
  startDate,
  endDate,
}: CategoryTrendChartProps) {
  // Fetch objection categories trend data from API
  const { data, isLoading, error } = useGetObjectionCategoriesTrend(
    organizationId,
    startDate,
    endDate
  );

  // Add debugging console log
  React.useEffect(() => {
    console.log("CategoryTrendChart data:", data);
  }, [data]);

  // Calculate date range description for the chart header
  const getDateRangeDescription = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return start === end ? start : `${start} - ${end}`;
    }
    
    // Default to last 3 months if no dates specified
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    
    const startStr = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
  };

  // Process the API data for the chart - format dates and handle sparse data
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Ensure all data points have the required properties
    const mappedData = data.map(item => ({
      date: item.date,
      price: item.price || 0,
      timing: item.timing || 0,
      trust: item.trust || 0,
      competition: item.competition || 0,
      stakeholders: item.stakeholders || 0,
      other: item.other || 0,
    }));
    
    // Filter out dates with zero objections for better readability
    const nonEmptyData = mappedData.filter(item => 
      item.price > 0 || 
      item.timing > 0 || 
      item.trust > 0 || 
      item.competition > 0 || 
      item.stakeholders > 0 || 
      item.other > 0
    );
    
    // If there's no non-empty data, return the original mapped data
    if (nonEmptyData.length === 0) {
      return mappedData;
    }
    
    // If we have more than 30 data points, sample to avoid overcrowding
    let dataToProcess = nonEmptyData;
    if (nonEmptyData.length > 30) {
      const step = Math.ceil(nonEmptyData.length / 30);
      dataToProcess = nonEmptyData.filter((_, index) => index % step === 0);
    }
    
    return dataToProcess.map(item => ({
      ...item,
      // Format date for display
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));
  }, [data]);

  // Define tooltip props interface
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      // Sort payload by value in descending order for better readability
      const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));
      
      return (
        <div className="p-3 bg-white border rounded-lg shadow-lg">
          <p className="text-gray-600 font-medium">{label}</p>
          {sortedPayload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render appropriate content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-64" />;
    }

    if (error) {
      return (
        <div className="w-full h-64 flex items-center justify-center text-red-500">
          Failed to load objection category data
        </div>
      );
    }

    if (!processedData || processedData.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center text-gray-500">
          No objection category data available for this time period
        </div>
      );
    }

    return (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name="Price"
              stroke={categoryColors.price}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="timing"
              name="Timing"
              stroke={categoryColors.timing}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="trust"
              name="Trust/Risk"
              stroke={categoryColors.trust}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="competition"
              name="Competition"
              stroke={categoryColors.competition}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="stakeholders"
              name="Stakeholders"
              stroke={categoryColors.stakeholders}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="other"
              name="Other"
              stroke={categoryColors.other}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Calculate total objections by type to show in the header
  const getTotalsByCategory = () => {
    if (!data || data.length === 0) return null;
    
    const totals = {
      price: 0,
      timing: 0,
      trust: 0,
      competition: 0,
      stakeholders: 0,
      other: 0
    };
    
    data.forEach(item => {
      totals.price += item.price || 0;
      totals.timing += item.timing || 0;
      totals.trust += item.trust || 0;
      totals.competition += item.competition || 0;
      totals.stakeholders += item.stakeholders || 0;
      totals.other += item.other || 0;
    });
    
    return totals;
  };
  
  const totals = getTotalsByCategory();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Objection Categories</CardTitle>
        <CardDescription>{getDateRangeDescription()}</CardDescription>
        {!isLoading && totals && (
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            <span style={{ color: categoryColors.price }}>
              Price: {totals.price}
            </span>
            <span style={{ color: categoryColors.timing }}>
              Timing: {totals.timing}
            </span>
            <span style={{ color: categoryColors.trust }}>
              Trust: {totals.trust}
            </span>
            <span style={{ color: categoryColors.competition }}>
              Competition: {totals.competition}
            </span>
            <span style={{ color: categoryColors.stakeholders }}>
              Stakeholders: {totals.stakeholders}
            </span>
            <span style={{ color: categoryColors.other }}>
              Other: {totals.other}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}