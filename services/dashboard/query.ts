import { useQuery } from "@tanstack/react-query";
import {
	getDashboardMetrics,
	getSentimentTrends,
	getCommonObjections,
	getTranscripts,
	getObjectionCategoriesTrend,
	getQuestionsRate,
	getTopicCoherence,
} from "./api";

// Common query options to reduce code duplication
const commonQueryOptions = {
	staleTime: 1000 * 60 * 5, // 5 minutes
	refetchOnWindowFocus: false,
	refetchOnMount: false,
	refetchOnReconnect: false,
	refetchInterval: false,
	refetchIntervalInBackground: false,
};

export const useGetDashboardMetrics = (
	orgId: string,
	options: { dateFilter?: string } = {}
) => {
	const { dateFilter } = options;

	return useQuery({
		queryKey: ["dashboardMetrics", dateFilter], // Include dateFilter in the queryKey
		queryFn: () => getDashboardMetrics(orgId, dateFilter),
		enabled: !!orgId,
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
	});
};

/**
 * Hook to fetch sentiment trends for the last 10 calls
 */
export const useGetSentimentTrends = (orgId: string) => {
	return useQuery({
		queryKey: ["sentimentTrends", orgId],
		queryFn: () => getSentimentTrends(orgId),
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		enabled: !!orgId,
	});
};

/**
 * Hook to fetch data about common objections
 */
export const useGetCommonObjections = (orgId: string) => {
	return useQuery({
		queryKey: ["commonObjections", orgId],
		queryFn: () => getCommonObjections(orgId),
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		enabled: !!orgId,
	});
};

/**
 * Hook to fetch paginated transcript data
 */
export const useGetTranscripts = (
	orgId: string,
	page: number = 1,
	limit: number = 10
) => {
	return useQuery({
		queryKey: ["transcripts", orgId, page, limit],
		queryFn: () => getTranscripts(orgId, page, limit),
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		enabled: !!orgId,
	});
};

/**
 * Hook to fetch questions rate metrics
 */
export const useGetQuestionsRate = (orgId: string) => {
	return useQuery({
		queryKey: ["questionsRate", orgId],
		queryFn: () => getQuestionsRate(orgId),
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		enabled: !!orgId,
	});
};

/**
 * Hook to fetch topic coherence metrics
 */
export const useGetTopicCoherence = (orgId: string) => {
	return useQuery({
		queryKey: ["topicCoherence", orgId],
		queryFn: () => getTopicCoherence(orgId),
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		enabled: !!orgId,
	});
};

/**
 * Hook to fetch objection categories trend data
 */
export const useGetObjectionCategoriesTrend = (
	orgId: string,
	startDate?: string,
	endDate?: string
) => {
	return useQuery({
		queryKey: ["objectionCategoriesTrend", orgId, startDate, endDate],
		queryFn: () => getObjectionCategoriesTrend(orgId, startDate, endDate),
		staleTime: 1000 * 60 * 60,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		enabled: !!orgId,
	});
};
