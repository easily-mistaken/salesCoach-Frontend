import React from "react";
import {
  ChevronRight,
  DollarSign,
  Clock,
  ShieldCheck,
  Briefcase,
  Users,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface AnalysisObjection {
  id: string;
  text: string;
  time?: string;
  response: string;
  effectiveness: number;
}

// Define a type for Lucide React icons
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface CategoryObjection {
  id: number | string;
  type: string;
  count: number;
  example: string;
  icon: LucideIcon;
  color: string;
  link: string;
}

// Define a structure for the API response
interface CommonObjectionsResponse {
  types: {
    PRICE: number;
    TIMING: number;
    TRUST_RISK: number;
    COMPETITION: number;
    STAKEHOLDERS: number;
    OTHERS: number;
    [key: string]: number;
  };
  topObjections: {
    text: string;
    count: number;
    type: string;
  }[];
}

interface ObjectionsListProps {
  objections:
    | AnalysisObjection[]
    | CategoryObjection[]
    | CommonObjectionsResponse
    | any;
}

// Objection type mapping
const objectionTypeMapping = {
  PRICE: {
    type: "Price",
    icon: DollarSign,
    color: "bg-red-100 text-red-600",
    link: "/dashboard/objections",
  },
  TIMING: {
    type: "Timing",
    icon: Clock,
    color: "bg-orange-100 text-orange-600",
    link: "/dashboard/objections",
  },
  TRUST_RISK: {
    type: "Trust/Risk",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600",
    link: "/dashboard/objections",
  },
  COMPETITION: {
    type: "Competition",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-600",
    link: "/dashboard/objections",
  },
  STAKEHOLDERS: {
    type: "Stakeholders",
    icon: Users,
    color: "bg-green-100 text-green-600",
    link: "/dashboard/objections",
  },
  OTHERS: {
    type: "Other",
    icon: HelpCircle,
    color: "bg-gray-100 text-gray-600",
    link: "/dashboard/objections",
  },
};

const ObjectionsList: React.FC<ObjectionsListProps> = ({ objections = [] }) => {
  // Guard against null or undefined objections
  if (!objections) {
    return (
      <div className="py-8 text-center text-gray-500">
        No objection data available
      </div>
    );
  }

  // Check if we're using the analysis objection format (with text field)
  if (
    Array.isArray(objections) &&
    objections.length > 0 &&
    objections[0] &&
    "text" in objections[0]
  ) {
    return (
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {objections.map((objection: any, index: number) => (
          <div key={objection.id || index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 text-blue-700 h-8 w-8 flex items-center justify-center mr-3 shrink-0">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-medium text-navy-800">
                    {(objection as AnalysisObjection).text}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{(objection as AnalysisObjection).time}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {Math.round(
                  (objection as AnalysisObjection).effectiveness * 100
                )}
                % Effective
              </span>
            </div>
            <div className="mt-3 pl-11">
              <p className="text-sm text-gray-600">
                {(objection as AnalysisObjection).response}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle the API response format with types and topObjections
  if (
    typeof objections === "object" &&
    objections !== null &&
    "types" in objections &&
    "topObjections" in objections
  ) {
    const typesData = objections.types || {};
    const topObjections = objections.topObjections || [];

    // Transform the API response into the format expected by the component
    const formattedObjections = Object.entries(typesData)
      .filter(([_, count]) => (count as number) > 0) // Only show types with counts > 0
      .map(([type, count], index) => {
        // Safely check if the type exists in mapping
        const mappingKey = type as keyof typeof objectionTypeMapping;
        const mapping = objectionTypeMapping[mappingKey] || {
          type: "Unknown",
          icon: HelpCircle,
          color: "bg-gray-100 text-gray-600",
          link: "/dashboard/objections",
        };

        // Find example text for this objection type
        const exampleObj = topObjections.find(
          (obj: { text: string; count: number; type: string }) =>
            obj && obj.type === type
        );
        const exampleText = exampleObj ? exampleObj.text : "";

        return {
          id: index + 1,
          type: mapping.type,
          count: count as number,
          example: exampleText,
          icon: mapping.icon,
          color: mapping.color,
          link: mapping.link,
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by count in descending order

    // If no data after filtering, show empty message
    if (formattedObjections.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          No objection data available
        </div>
      );
    }

    // Render these formatted objections
    return (
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {formattedObjections.map((objection) => (
          <Link key={objection.id} href={objection.link} className="block">
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div
                className={`${objection.color} h-10 w-10 rounded-full flex items-center justify-center mr-4 shrink-0`}
              >
                <objection.icon className="h-5 w-5" />
              </div>
              <div className="grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-navy-800">{objection.type}</p>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {objection.count}×
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {objection.example}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // If it's an empty array
  if (Array.isArray(objections) && objections.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No objection data available
      </div>
    );
  }

  // Fallback for other invalid data - show empty state message
  return (
    <div className="py-8 text-center text-gray-500">
      No objection data available
    </div>
  );
};

export default ObjectionsList;
