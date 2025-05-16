
import React from "react";

export function ServiceLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p>Loading service data...</p>
      </div>
    </div>
  );
}
