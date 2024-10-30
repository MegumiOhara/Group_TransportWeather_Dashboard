import React from "react";

function LoadingModal() {
   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="animate-spin h-12 w-12 border-4 border-solid border-white border-t-transparent rounded-full"></div>
      </div>
   );
}

export default LoadingModal;
