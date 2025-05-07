import React from "react";

export const SkeletonLoader = ({
  height = "h-8",
  width = "w-16",
  className = "",
}) => (
  <div
    className={`${height} ${width} bg-gray-200 rounded-md animate-pulse ${className}`}
  />
);

export const DoubleLineLoader = () => (
  <div className="space-y-2">
    <SkeletonLoader height="h-8" width="w-24" />
    <SkeletonLoader height="h-4" width="w-32" className="mt-1" />
  </div>
);
