import { api } from "@/utils/axios";

// Types for objections data
type ObjectionCategory =
  | "PRICE"
  | "TIMING"
  | "TRUST_RISK"
  | "COMPETITION"
  | "STAKEHOLDERS"
  | "OTHERS"
  | "TECHNICAL"
  | "IMPLEMENTATION"
  | "VALUE"
  | "all";

interface Objection {
  id: string;
  type: ObjectionCategory;
  text: string;
  transcript: string;
  date: string;
  response: string;
  effectiveness: number;
  color: string;
  success: boolean;
}

interface CategoryCounts {
  price: number;
  timing: number;
  trust: number;
  competition: number;
  stakeholders: number;
  other: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ObjectionsResponse {
  data: Objection[];
  pagination: PaginationInfo;
}

/**
 * Fetches the counts of objections by category
 * @param orgId The organization ID
 * @returns Promise with counts of objections by category
 */
export const getCategoryCounts = async (
  orgId: string
): Promise<CategoryCounts> => {
  const response = await api.get("/api/objections/categoryCounts", {
    params: { orgId },
  });
  return response.data;
};

/**
 * Fetches objections with pagination, filtering and search
 * @param orgId The organization ID
 * @param page The page number (starting from 1)
 * @param limit The number of items per page
 * @param search Optional search term for filtering objections
 * @param type Optional objection type filter
 * @returns Promise with paginated objection data
 */
export const getObjections = async (
  orgId: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  type: "all" | ObjectionCategory = "all"
): Promise<ObjectionsResponse> => {
  const response = await api.get("/api/objections", {
    params: {
      orgId,
      page,
      limit,
      search,
      type,
    },
  });
  return response.data;
};

/**
 * Fetches a single objection by ID
 * @param orgId The organization ID
 * @param id The objection ID
 * @returns Promise with the objection data
 */
export const getObjectionById = async (
  orgId: string,
  id: string
): Promise<Objection> => {
  const response = await api.get(`/api/objections/${id}`, {
    params: { orgId },
  });
  return response.data;
};

// Add more API functions as needed for your objections feature

// Export types for use in other files
export type {
  ObjectionCategory,
  Objection,
  CategoryCounts,
  PaginationInfo,
  ObjectionsResponse,
};
