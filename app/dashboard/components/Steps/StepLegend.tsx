import React from "react";

export const StepLegend = () => {
  return (
    <div className="flex flex-wrap gap-6 mb-6 justify-center">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-black flex items-center justify-center"></div>
        <span className="font-medium">Step Number</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-green-600 rounded-full border-2 border-black flex items-center justify-center"></div>
        <span className="font-medium">User Count</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-blue-100 rounded-lg border-2 border-black"></div>
        <span className="font-medium">Sales</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-purple-100 rounded-lg border-2 border-black"></div>
        <span className="font-medium">Admin</span>
      </div>
    </div>
  );
};
