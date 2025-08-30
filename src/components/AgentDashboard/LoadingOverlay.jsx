import React from 'react';
import { Loader } from 'lucide-react';

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-lg">
      <Loader className="h-6 w-6 animate-spin text-blue-600" />
      <span className="text-gray-900">Loading...</span>
    </div>
  </div>
);

export default LoadingOverlay;
