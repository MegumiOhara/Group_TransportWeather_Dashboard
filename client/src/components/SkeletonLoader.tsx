import React from "react";

interface SkeletonLoaderProps {
   width: string;
   height: string;
   className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width, height }) => {
   return (
      <div
         className={`bg-slate-200 rounded animate-pulse ${width} ${height} rounded-md mb-2`}></div>
   );
};

export default SkeletonLoader;
