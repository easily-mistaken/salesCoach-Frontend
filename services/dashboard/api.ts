import { CategoryObjection } from "@/components/ObjectionsList";
import { api } from "@/utils/axios";

// Types for dashboard data
type DashboardMetrics = {
	transcripts: {
		count: number;
	};
	sentiment: {
		average: number;
	};
	objections: {
		total: number;
		successful: number;
		successRate: number;
	};
	talkRatio: {
		average: number;
		callsAnalyzed: number;
	};
};

interface TranscriptsCountResponse {
	count: number;
}

interface AverageSentimentResponse {
	averageSentiment: number;
}

interface ObjectionsHandledResponse {
	total: number;
	successful: number;
	rate: number;
}

interface TalkRatioResponse {
	talkRatio: number;
	callsAnalyzed: number;
}

interface SentimentTrendItem {
	name: string;
	positive: string;
	negative: string;
	neutral: string;
}

type SentimentTrendsResponse = SentimentTrendItem[];

// New response types for questions rate and topic coherence
interface QuestionsRateResponse {
	averageQuestionsRate: number;
	averageQuestionsPerCall: number;
	totalCalls: number;
}

interface TopicCoherenceResponse {
	averageCoherence: number;
	totalCalls: number;
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
	objections: Objection[];
	sentimentEntries: SentimentEntry[];
	// New fields
	questionsRate?: number;
	totalQuestions?: number;
	topicCoherence?: number;
}

interface Objection {
	id: string;
	text: string;
	time: string;
	response: string;
	effectiveness: number;
	type:
		| "PRICE"
		| "TIMING"
		| "TRUST_RISK"
		| "COMPETITION"
		| "STAKEHOLDERS"
		| "OTHERS";
	success: boolean;
	createdAt: string;
	updatedAt: string;
	analysisId: string;
}

interface SentimentEntry {
	id: string;
	time: string;
	score: number;
	createdAt: string;
	updatedAt: string;
	analysisId: string;
}

interface User {
	firstName: string | null;
	lastName: string | null;
	id: string;
}

interface CallAsset {
	id: string;
	content: string;
	type: "FILE" | "TEXT";
	name: string | null;
	status: "PENDING" | "SUCCESS" | "FAIL";
	createdAt: string;
	updatedAt: string;
	userId: string;
	organizationId: string | null;
	analysis: Analysis | null;
	user: User;
}

interface PaginationInfo {
	total: number;
	page: number;
	limit: number;
	pages: number;
}

interface TranscriptsResponse {
	data: CallAsset[];
	pagination: PaginationInfo;
}

interface ObjectionTypeCounts {
	[key: string]: number;
	PRICE: number;
	TIMING: number;
	TRUST_RISK: number;
	COMPETITION: number;
	STAKEHOLDERS: number;
	OTHERS: number;
}

interface CommonObjectionsResponse {
	types: ObjectionTypeCounts;
	topObjections: {
		text: string;
		count: number;
		type: string;
	}[];
}

// Type for the objection categories trend data
interface ObjectionCategoryTrendItem {
	date: string; // ISO date string YYYY-MM-DD
	price: number; // Count of PRICE objections on this date
	timing: number; // Count of TIMING objections on this date
	trust: number; // Count of TRUST_RISK objections on this date
	competition: number; // Count of COMPETITION objections on this date
	stakeholders: number; // Count of STAKEHOLDERS objections on this date
	other: number; // Count of OTHERS objections on this date
}

type ObjectionCategoriesTrendResponse = ObjectionCategoryTrendItem[];

export const getDashboardMetrics = async (
	orgId: string,
	dateFilter?: string
): Promise<DashboardMetrics> => {
	const params: { orgId: string; dateFilter?: string } = { orgId };

	// Only add dateFilter to params if it exists and is not an empty string
	if (dateFilter) {
		params.dateFilter = dateFilter;
	}

	const response = await api.get("/api/dashboard/metrics", {
		params: params,
	});

	return response.data;
};

/**
 * Fetches sentiment trends for the last 10 calls
 * @param orgId The organization ID
 * @returns Promise with sentiment trend data
 */
const getSentimentTrends = async (
	orgId: string
): Promise<SentimentTrendsResponse> => {
	const response = await api.get("/api/dashboard/sentimentTrends", {
		params: { orgId },
	});
	return response.data;
};

/**
 * Fetches data about common objections
 * @param orgId The organization ID
 * @returns Promise with common objection data
 */
const getCommonObjections = async (
	orgId: string
): Promise<CategoryObjection> => {
	const response = await api.get("/api/dashboard/commonObjections", {
		params: { orgId },
	});
	return response.data;
};

/**
 * Fetches paginated transcript data with analysis
 * @param orgId The organization ID
 * @param page The page number (starting from 1)
 * @param limit The number of items per page
 * @returns Promise with paginated transcript data
 */
const getTranscripts = async (
	orgId: string,
	page: number = 1,
	limit: number = 10
): Promise<TranscriptsResponse> => {
	const response = await api.get("/api/dashboard/transcripts", {
		params: { orgId, page, limit },
	});
	return response.data;
};

/**
 * Fetches questions rate metrics
 * @param orgId The organization ID
 * @returns Promise with questions rate data
 */
const getQuestionsRate = async (
	orgId: string
): Promise<QuestionsRateResponse> => {
	const response = await api.get("/api/dashboard/questionsRate", {
		params: { orgId },
	});
	return response.data;
};

/**
 * Fetches topic coherence metrics
 * @param orgId The organization ID
 * @returns Promise with topic coherence data
 */
const getTopicCoherence = async (
	orgId: string
): Promise<TopicCoherenceResponse> => {
	const response = await api.get("/api/dashboard/topicCoherence", {
		params: { orgId },
	});
	return response.data;
};

/**
 * Fetches objection categories trend data
 * @param orgId The organization ID
 * @param startDate Optional start date (YYYY-MM-DD)
 * @param endDate Optional end date (YYYY-MM-DD)
 * @returns Promise with objection categories trend data
 */
const getObjectionCategoriesTrend = async (
	orgId: string,
	startDate?: string,
	endDate?: string
): Promise<ObjectionCategoriesTrendResponse> => {
	const response = await api.get("/api/dashboard/objectionCategoriesTrend", {
		params: {
			orgId,
			...(startDate && { startDate }),
			...(endDate && { endDate }),
		},
	});
	return response.data;
};

export {
	getSentimentTrends,
	getCommonObjections,
	getTranscripts,
	getQuestionsRate,
	getTopicCoherence,
	getObjectionCategoriesTrend,
	// Export types for use in other files
	type TranscriptsCountResponse,
	type AverageSentimentResponse,
	type ObjectionsHandledResponse,
	type TalkRatioResponse,
	type SentimentTrendItem,
	type SentimentTrendsResponse,
	type TranscriptsResponse,
	type CommonObjectionsResponse,
	type QuestionsRateResponse,
	type TopicCoherenceResponse,
	type ObjectionCategoriesTrendResponse,
	type ObjectionCategoryTrendItem,
	type CallAsset,
	type Analysis,
	type Objection,
	type SentimentEntry,
	type PaginationInfo,
};
