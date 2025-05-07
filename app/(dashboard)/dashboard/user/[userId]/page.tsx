"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Phone,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  BarChart4,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCurrentOrg from "@/store/useCurrentOrg";
import { useGetUserDetail } from "@/services/user/query"; // Import our query hook

const UserDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { currentOrg } = useCurrentOrg(); // Get current org from Zustand store
  
  const userId = params.userId as string;
  const orgId = currentOrg?.id;

  const [activeTab, setActiveTab] = useState("overview");

  // Use react-query to fetch user data
  const { 
    data: user, 
    isLoading, 
    isError, 
    error 
  } = useGetUserDetail(userId, orgId || '');

  const handleBack = () => {
    router.push("/dashboard/teams");
  };

  const handleViewTranscript = (transcriptId: string) => {
    router.push(`/dashboard/transcripts/${transcriptId}`);
  };

  if (!orgId) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>No organization selected. Please select an organization first.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-600"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-900">
            Error: {isError ? (error as any).message || 'Could not fetch user details' : 'User not found'}
          </h3>
          <p className="mt-2 text-gray-600">
            We couldn't find the user you're looking for.
          </p>
          <Button onClick={handleBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-600"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>

        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-gray-600">{user.email}</p>
                <span className="text-gray-400">•</span>
                <Badge variant="outline">{user.role}</Badge>
              </div>
              {user.joinDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {user.bio && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <p className="text-gray-600">{user.bio}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Calls Made</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-3xl font-bold">
                    {user.metrics.calls}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Objections Handled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-3xl font-bold">
                    {user.metrics.objections}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Closing Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Badge className="h-5 bg-green-100 text-green-800 mr-2">
                    %
                  </Badge>
                  <span className="text-3xl font-bold">
                    {user.metrics.closingRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Monthly tracking of key performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {user.performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={user.performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="calls"
                      stroke="#3b82f6"
                      name="Calls"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="objections"
                      stroke="#f59e0b"
                      name="Objections"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="closingRate"
                      stroke="#10b981"
                      name="Closing Rate %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No performance data available
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {user.transcripts && user.transcripts.length > 0 ? (
                  <div className="space-y-4">
                    {user.transcripts.slice(0, 3).map((transcript) => (
                      <div key={transcript.id} className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                          <Phone className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{transcript.title}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span className="mr-2">{transcript.date}</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{transcript.length}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Closing Rate</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.metrics.closingRate}% success rate on objection handling.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                      <BarChart4 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Call Activity</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.metrics.calls} total calls with {user.metrics.transcripts} analyzed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 mt-1">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Objection Handling</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Successfully addressed a total of {user.metrics.objections} objections
                        {user.transcripts && user.transcripts.length > 0 ? 
                          ` (avg. ${(user.metrics.objections / user.transcripts.length).toFixed(1)} per call).` : 
                          '.'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed breakdown of performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Call Volume</h3>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(user.metrics.calls / 60) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span>{user.metrics.calls} calls</span>
                    <span>60</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Objection Handling
                  </h3>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${(user.metrics.objections / 40) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span>{user.metrics.objections} objections</span>
                    <span>40</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Closing Rate</h3>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${user.metrics.closingRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{user.metrics.closingRate}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {user.performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={user.performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="calls"
                      stroke="#3b82f6"
                      name="Calls"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="objections"
                      stroke="#f59e0b"
                      name="Objections"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="closingRate"
                      stroke="#10b981"
                      name="Closing Rate %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No performance data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Call Transcripts
          </h2>
          {user.transcripts && user.transcripts.length > 0 ? (
            <div className="space-y-4">
              {user.transcripts.map((transcript) => (
                <Card key={transcript.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{transcript.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{transcript.date}</span>
                          <span className="mx-2">•</span>
                          <span>{transcript.length}</span>
                          <span className="mx-2">•</span>
                          <span>{transcript.objections} objections</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTranscript(transcript.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No transcripts available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default UserDetailPage;