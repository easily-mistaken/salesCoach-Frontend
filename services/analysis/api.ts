import { api } from "@/utils/axios";
import { Objection } from "../objections/api";

// Types for analysis data
interface SentimentEntry {
  id: string;
  time: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  analysisId: string;
}
interface ParticipantTalkStat {
  id: string;
  name: string;
  role: string;
  wordCount: number;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  analysisId: string;
}

interface Analysis {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  summary: string;
  overallSentiment: number;
  keyInsights: string[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
  callAssetId: string;
  salesRepTalkRatio: number;
  objections: Objection[];
  sentimentEntries: SentimentEntry[];
  participantTalkStats: ParticipantTalkStat[];
}

interface CallAsset {
  id: string;
  content: string;
  type: 'FILE' | 'TEXT';
  name: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAIL';
  createdAt: string;
  updatedAt: string;
  userId: string;
  organizationId: string | null;
  analysis: Analysis | null;
}

interface GetCallAssetResponse {
  asset: CallAsset;
}

/**
 * Fetches a single call asset with its analysis by ID
 * @param id The call asset ID
 * @returns Promise with the call asset and its analysis
 */
export const getCallAssetWithAnalysis = async (id: string): Promise<GetCallAssetResponse> => {
  const response = await api.get(`/api/callasset/${id}`);
  return response.data;
};

/**
 * Transforms sentiment entries to a format suitable for the SentimentChart component
 * @param sentimentEntries Array of sentiment entries from the API
 * @returns Transformed data ready for the chart
 */
export const transformSentimentData = (sentimentEntries: SentimentEntry[]) => {
  return sentimentEntries.map(entry => ({
    name: entry.time,
    positive: Math.max(0, entry.score * 100), // Convert score to a percentage for positive sentiment
    negative: Math.max(0, (1 - entry.score) * 100), // Inverse for negative sentiment
    neutral: 50 // Fixed value for demonstration
  }));
};

/**
 * Formats a date string to a user-friendly format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export type {
  Analysis,
  CallAsset,
  GetCallAssetResponse,
  ParticipantTalkStat,
  SentimentEntry
};