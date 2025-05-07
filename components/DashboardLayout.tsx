"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useGetUser } from "@/services/user/query";
import DashboardLayoutSkeleton from "@/components/DashboardLayoutSkeleton";
import useCurrentOrg, { Organization } from "@/store/useCurrentOrg";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useUploadAsset } from "@/services/callasset/mutation";
import { generatePresignedUrls } from "@/app/(dashboard)/dashboard/upload/action";
import { Progress } from "@/components/ui/progress";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFile, setSidebarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<
    "idle" | "preparing" | "uploading" | "processing" | "complete" | "error"
  >("idle");
  const pathname = usePathname();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useGetUser();

  const { currentOrg } = useCurrentOrg();
  const { toast } = useToast();
  const router = useRouter();
  const uploadAssetMutation = useUploadAsset();

  // Add mock organization data
  const orgName = currentOrg?.name;
  const orgLogo =
    "https://api.dicebear.com/7.x/initials/svg?seed=" +
    (orgName ? orgName[0] : "A") +
    "&backgroundColor=0284c7"; // Using DiceBear for placeholder logo

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Teams", href: "/dashboard/teams", icon: Users },
    { name: "Upload", href: "/dashboard/upload", icon: Upload },
    { name: "Transcripts", href: "/dashboard/transcripts", icon: FileText },
    { name: "Objections", href: "/dashboard/objections", icon: MessageSquare },
    { name: "Insights", href: "/dashboard/insights", icon: PieChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Handle file selection
  const handleSidebarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSidebarFile(e.target.files[0]);
      setUploadProgress(0);
      setUploadStage("idle");
    }
  };

  // Handle file upload with progress tracking
  const handleSidebarFileUpload = async () => {
    if (!sidebarFile) return;

    if (!currentOrg || !currentOrg.id) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadStage("preparing");

      // Get userId from Supabase
      const supabase = await createClient();
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      setUploadProgress(20);

      // Generate presigned URL
      const presignedUrls = await generatePresignedUrls(
        [sidebarFile.name],
        "application/octet-stream",
        userId
      );

      if (!presignedUrls[0]) {
        throw new Error("Error generating upload URL");
      }

      setUploadProgress(30);
      setUploadStage("uploading");

      // Upload file to presigned URL with progress tracking
      await uploadWithProgress(presignedUrls[0], sidebarFile);

      setUploadProgress(80);
      setUploadStage("processing");

      // Extract the file URL from the presigned URL
      const baseUrl =
        "https://eszghbzdaorgzigavzkm.supabase.co/storage/v1/object/public";
      const urlParts = presignedUrls[0].split("/");
      const signIndex = urlParts.findIndex((part: string) => part === "sign");
      const relativePath = urlParts
        .slice(signIndex + 2)
        .join("/")
        .split("?")[0];
      const fileUrl = `${baseUrl}/uploads/${relativePath}`;

      // Call the mutation with the file URL and get the response
      const response = await uploadAssetMutation.mutateAsync({
        content: fileUrl,
        type: "FILE",
        organisationId: currentOrg.id,
      });

      setUploadProgress(100);
      setUploadStage("complete");

      // Show success message
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Short delay to show the completed state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear the file and reset states
      setSidebarFile(null);
      setUploadProgress(0);
      setUploadStage("idle");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect to the analysis page instead of dashboard
      if (response?.asset?.id) {
        router.push(`/dashboard/analysis/${response.asset.id}`);
      } else {
        // Fallback to dashboard if no asset ID
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStage("error");
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Upload with progress tracking
  const uploadWithProgress = async (url: string, file: File) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          // Map upload progress to 30-80% of our total progress bar
          const progressPercentage = (event.loaded / event.total) * 50;
          setUploadProgress(30 + progressPercentage);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  // Handle file removal
  const handleRemoveFile = () => {
    if (!isUploading) {
      setSidebarFile(null);
      setUploadProgress(0);
      setUploadStage("idle");
      // Reset the file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const { setCurrentOrg } = useCurrentOrg();
  useEffect(() => {
    if (user) {
      const currOrg = user.organizations?.[0]?.organization;
      setCurrentOrg(currOrg as Organization);
    }
  }, [user, setCurrentOrg]);

  // Use our skeleton component instead of "Loading..."
  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }

  // Get stage message for progress bar
  const getStageMessage = () => {
    switch (uploadStage) {
      case "preparing":
        return "Preparing upload...";
      case "uploading":
        return "Uploading file...";
      case "processing":
        return "Processing file...";
      case "complete":
        return "Upload complete";
      case "error":
        return "Upload failed";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        <div className="flex flex-col h-full bg-navy-800 overflow-y-auto">
          {/* Sidebar header */}
          <div className="flex items-center h-16 shrink-0 px-4 border-b border-navy-700">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">
                CloseDash<span className="text-[#0284c7]">.io</span>
              </span>
            </Link>
          </div>

          {/* Sidebar navigation */}
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {user &&
                user?.organizations?.length > 0 &&
                navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md 
                      ${
                        isActive
                          ? "bg-navy-700 text-white"
                          : "text-gray-300 hover:bg-navy-700 hover:text-white"
                      }
                    `}
                    >
                      <item.icon
                        className={`
                        mr-3 shrink-0 h-6 w-6 
                        ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-300"
                        }
                      `}
                      />
                      {item.name}
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Upload section */}
          {user && user?.organizations?.length > 0 && (
            <div className="p-4 border-t border-navy-700">
              <div className="rounded-md overflow-hidden">
                <div className="px-3 py-2 bg-navy-700 text-white text-sm font-medium">
                  Quick Upload
                </div>
                <div className="p-3 bg-navy-700 bg-opacity-50">
                  {!isUploading && !sidebarFile && (
                    <label
                      htmlFor="sidebar-dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-24 border border-navy-600 border-dashed rounded-md cursor-pointer hover:bg-navy-700 transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center justify-center p-2">
                        <Upload className="h-5 w-5 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-300 text-center">
                          <span className="font-medium">Click to upload</span>{" "}
                          or drag files
                        </p>
                      </div>
                      <input
                        id="sidebar-dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleSidebarFileChange}
                        ref={fileInputRef}
                        accept=".txt,.pdf,.vtt,.doc,.docx"
                        disabled={isUploading}
                      />
                    </label>
                  )}

                  {sidebarFile && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-300 flex justify-between items-center gap-1">
                        <span
                          className="truncate max-w-[85%]"
                          title={sidebarFile.name}
                        >
                          {sidebarFile.name}
                        </span>
                        {!isUploading && (
                          <button
                            onClick={handleRemoveFile}
                            className="text-gray-400 hover:text-white flex-shrink-0"
                            title="Remove file"
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {uploadProgress > 0 && (
                        <div className="mt-2 mb-2">
                          <Progress
                            value={uploadProgress}
                            className="h-1.5 bg-navy-600"
                            color={
                              uploadStage === "error" ? "bg-red-500" : undefined
                            }
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-400">
                              {getStageMessage()}
                            </span>
                            {uploadStage === "complete" && (
                              <span className="text-xs text-green-400">
                                ✓ Done
                              </span>
                            )}
                            {uploadStage === "error" && (
                              <span className="text-xs text-red-400">
                                ✗ Failed
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-400">
                          {(sidebarFile.size / 1024).toFixed(1)} KB
                        </div>
                        {!isUploading ? (
                          <button
                            onClick={handleSidebarFileUpload}
                            className="text-xs px-2 py-1 bg-[#0284c7] text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                            disabled={isUploading}
                          >
                            Upload
                          </button>
                        ) : (
                          <button
                            className="text-xs px-2 py-1 bg-gray-600 text-white rounded flex items-center space-x-1 cursor-not-allowed"
                            disabled
                          >
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            <span>Uploading</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Help section */}
          <div className="p-4 border-t border-navy-700">
            <div className="rounded-md">
              <Link
                href="/help"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
              >
                <HelpCircle className="mr-3 shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                Help & Support
              </Link>
            </div>
          </div>

          {/* Organization section - Desktop */}
          {user && user?.organizations?.length > 0 && (
            <div className="p-4 border-t border-navy-700 mt-auto">
              <Link href="/dashboard/organisation">
                <div className="rounded-md bg-navy-700 bg-opacity-50 p-3 hover:bg-navy-600 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={orgLogo || "/placeholder-org.svg"}
                        alt={`${orgName} Logo`}
                      />
                      <AvatarFallback className="bg-navy-600 text-white">
                        {orgName ? orgName.charAt(0).toUpperCase() : "O"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">
                        {orgName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        Organization
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`
        md:hidden fixed inset-0 flex z-40 transition-opacity duration-300
        ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-navy-900 bg-opacity-75 transition-opacity duration-300
            ${sidebarOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`
          relative flex-1 flex flex-col max-w-xs w-full bg-navy-800 transform transition duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center h-16 shrink-0 px-4 border-b border-navy-700">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">
                CloseDash<span className="text-[#0284c7]">.io</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          {user && user?.organizations?.length > 0 && (
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${
                        isActive
                          ? "bg-navy-700 text-white"
                          : "text-gray-300 hover:bg-navy-700 hover:text-white"
                      }
                    `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`
                        mr-3 shrink-0 h-6 w-6
                        ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-300"
                        }
                      `}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Help */}
          {user && user?.organizations?.length > 0 && (
            <div className="p-4 border-t border-navy-700">
              <Link
                href="/help"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <HelpCircle className="mr-3 shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                Help & Support
              </Link>
            </div>
          )}

          {/* Organization section - Mobile */}
          {user && user?.organizations?.length > 0 && (
            <div className="p-4 border-t border-navy-700 mt-auto">
              <Link
                href="/dashboard/organisation"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="rounded-md bg-navy-700 bg-opacity-50 p-3 hover:bg-navy-600 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={orgLogo || "/placeholder-org.svg"}
                        alt={`${orgName} Logo`}
                      />
                      <AvatarFallback className="bg-navy-600 text-white">
                        {orgName ? orgName.charAt(0).toUpperCase() : "O"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">
                        {orgName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        Organization
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 relative w-full">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 md:hidden shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-navy-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 flex justify-between items-center px-4">
            <div className="flex-1 flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-navy-800">
                  CloseDash<span className="text-[#0284c7]">.io</span>
                </span>
              </Link>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Top bar desktop */}
        <div className="hidden md:flex sticky top-0 z-10 shrink-0 h-16 bg-white border-b border-gray-200">
          <div className="flex-1 flex justify-end px-4">
            <div className="ml-4 flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-x-auto">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

const UserMenu = () => {
  const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  const { data: user, isLoading } = useGetUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-8 w-8 rounded-full border-gray-200 bg-white hover:bg-sky-100 hover:border-sky-300 transition-all duration-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&color=fff&background=102E50`}
            />
            <AvatarFallback className="bg-navy-700 text-white">
              {isLoading
                ? "..."
                : (user?.firstName?.charAt(0).toUpperCase() || "") +
                  (user?.lastName?.charAt(0).toUpperCase() || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-gray-900">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0 focus:bg-transparent focus:text-inherit">
          <Link
            href="/dashboard/settings"
            className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm text-navy-800 hover:text-navy-900 hover:bg-sky-100 transition-colors"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 focus:bg-transparent focus:text-inherit">
          <Link
            href="/settings"
            className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm text-navy-800 hover:text-navy-900 hover:bg-sky-100 transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardLayout;
