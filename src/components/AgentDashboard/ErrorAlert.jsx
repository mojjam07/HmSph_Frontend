import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 shadow-lg z-50">
    <AlertCircle className="h-5 w-5 text-red-600" />
    <span className="text-red-800">{message}</span>
    <button onClick={onClose} className="text-red-600 hover:text-red-800">
      <X className="h-4 w-4" />
    </button>
  </div>
);

export default ErrorAlert;
