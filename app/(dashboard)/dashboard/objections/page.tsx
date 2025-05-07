"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Download, 
  ListFilter, 
  MessageSquare, 
  Search, 
  ShieldCheck,
  Briefcase,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import useOrganization from "@/store/useCurrentOrg"; // Assuming you have this hook
import { 
  useGetCategoryCounts,
  useGetObjections,
} from "@/services/objections/query";
import {ObjectionCategory} from "@/services/objections/api"

// Helper function to map category to icon
const getCategoryIcon = (category: ObjectionCategory) => {
  switch (category) {
    case "PRICE":
      return <DollarSign className="h-5 w-5" />;
    case "TIMING":
      return <Clock className="h-5 w-5" />;
    case "TRUST_RISK":
      return <ShieldCheck className="h-5 w-5" />;
    case "COMPETITION":
      return <Briefcase className="h-5 w-5" />;
    case "STAKEHOLDERS":
      return <Users className="h-5 w-5" />;
    default:
      return <MessageSquare className="h-5 w-5" />;
  }
};

const ObjectionsPage: React.FC = () => {
  const { toast } = useToast();
  const { currentOrg } = useOrganization();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | ObjectionCategory>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Reset pagination when search or tab changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  // Fetch category counts
  const { 
    data: categoryCounts = { 
      price: 0, 
      timing: 0, 
      trust: 0, 
      competition: 0, 
      stakeholders: 0, 
      other: 0 
    },
    isLoading: isLoadingCounts,
    error: countError
  } = useGetCategoryCounts(currentOrg?.id || "");

  // Fetch objections
  const {
    data: objectionsResponse,
    isLoading: isLoadingObjections,
    error: objectionsError
  } = useGetObjections(
    currentOrg?.id || "",
    page,
    limit,
    debouncedSearch,
    activeTab,
    !!currentOrg?.id
  );

  // Extract objections and add icons
  const objections = objectionsResponse?.data.map(objection => ({
    ...objection,
    icon: getCategoryIcon(objection.type)
  })) || [];

  // Handle pagination
  const totalPages = objectionsResponse?.pagination.pages || 1;

  // Handle errors
  useEffect(() => {
    if (countError) {
      toast({
        title: "Error",
        description: "Failed to load objection categories",
        variant: "destructive",
      });
    }
    
    if (objectionsError) {
      toast({
        title: "Error",
        description: "Failed to load objections",
        variant: "destructive",
      });
    }
  }, [countError, objectionsError, toast]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | ObjectionCategory);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Objection Library</h1>
            <p className="text-gray-600">Track and analyze sales objections and your responses</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ListFilter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Category Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Price</CardTitle>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingCounts ? "..." : categoryCounts.price}</div>
              <Progress value={categoryCounts.price * 10} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Timing</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingCounts ? "..." : categoryCounts.timing}</div>
              <Progress value={categoryCounts.timing * 10} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Trust/Risk</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingCounts ? "..." : categoryCounts.trust}</div>
              <Progress value={categoryCounts.trust * 10} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Competition</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingCounts ? "..." : categoryCounts.competition}</div>
              <Progress value={categoryCounts.competition * 10} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stakeholders</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingCounts ? "..." : categoryCounts.stakeholders}</div>
              <Progress value={categoryCounts.stakeholders * 10} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Other</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingCounts ? "..." : categoryCounts.other}</div>
              <Progress value={categoryCounts.other * 10} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search objections..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline">Advanced Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Objections List */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="PRICE">Price</TabsTrigger>
                <TabsTrigger value="TIMING">Timing</TabsTrigger>
                <TabsTrigger value="TRUST_RISK">Trust</TabsTrigger>
                <TabsTrigger value="COMPETITION">Competition</TabsTrigger>
                <TabsTrigger value="STAKEHOLDERS">Stakeholders</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoadingObjections ? (
                <div className="text-center py-8">
                  <p>Loading objections...</p>
                </div>
              ) : objections.length > 0 ? (
                <>
                  {objections.map((objection) => (
                    <div key={objection.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className={`${objection.color} h-10 w-10 rounded-full flex items-center justify-center shrink-0`}>
                          {objection.icon}
                        </div>
                        <div className="grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <h3 className="font-medium text-navy-800">{objection.text}</h3>
                            <div className="flex items-center">
                              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2">
                                {objection.transcript}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                objection.effectiveness > 0.8 
                                  ? "bg-green-100 text-green-800" 
                                  : objection.effectiveness > 0.6 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {Math.round(objection.effectiveness * 100)}% Effective
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-700">Your Response:</h4>
                            <p className="text-sm text-gray-600 mt-1">{objection.response}</p>
                          </div>
                          <div className="mt-4 text-xs text-gray-500">
                            From call on {new Date(objection.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short", 
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handlePrevPage} 
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <div className="text-sm">
                        Page {page} of {totalPages}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleNextPage} 
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No objections found</h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your search or filters to find objections
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ObjectionsPage;