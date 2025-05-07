import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, AlertCircle } from 'lucide-react';

// Define the interface for a transcript item
interface TranscriptItem {
  id: string;
  name?: string | null;
  createdAt: string;
  analysis?: {
    title?: string;
    date: string;
    duration: string;
    overallSentiment: number;
  } | null;
}

interface RecentTranscriptsListProps {
  data?: TranscriptItem[];
  isLoading?: boolean;
  isError?: boolean;
}

const RecentTranscriptsList: React.FC<RecentTranscriptsListProps> = ({ 
  data = [], 
  isLoading = false,
  isError = false
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex flex-col w-full">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded w-full mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Failed to load transcripts. Please try again later.</p>
      </div>
    );
  }

  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p>No transcripts available yet.</p>
      </div>
    );
  }

  // Helper function to determine sentiment label and color based on sentiment score
  const getSentimentInfo = (sentimentScore: number) => {
    const normalizedScore = (sentimentScore + 1) / 2; // Normalize from [-1, 1] to [0, 1]
    
    if (normalizedScore >= 0.7) {
      return { label: 'Positive', color: 'bg-green-100 text-green-800' };
    } else if (normalizedScore >= 0.4) {
      return { label: 'Neutral', color: 'bg-blue-100 text-blue-800' };
    } else if (normalizedScore >= 0.3) {
      return { label: 'Mixed', color: 'bg-orange-100 text-orange-800' };
    } else {
      return { label: 'Negative', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Title</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Duration</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Sentiment</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transcript) => {
            const sentimentInfo = transcript.analysis 
              ? getSentimentInfo(transcript.analysis.overallSentiment)
              : { label: 'N/A', color: 'bg-gray-100 text-gray-800' };
            
            return (
              <tr key={transcript.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-navy-800">
                      {transcript.analysis?.title || 'Unnamed Transcript'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {transcript.analysis 
                    ? new Date(transcript.analysis.date).toLocaleDateString() 
                    : new Date(transcript.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {transcript.analysis?.duration || 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={sentimentInfo.color}>
                    {sentimentInfo.label}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Link 
                    href={`/dashboard/analysis/${transcript.id}`} 
                    className="text-[#0284c7] hover:text-[#0284c7]/90 font-medium flex items-center"
                  >
                    View
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTranscriptsList;