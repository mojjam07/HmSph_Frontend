import React from 'react';
import { X, Mail, Phone } from 'lucide-react';

const AgentModal = ({ agent, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Agent Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <img 
            src={agent.profilePicture} 
            alt=""
            className="h-20 w-20 rounded-full"
          />
          <div>
            <h4 className="text-xl font-medium text-gray-900">
              {agent.firstName} {agent.lastName}
            </h4>
            <p className="text-gray-600">{agent.businessName}</p>
            <p className="text-sm text-gray-500">License: {agent.licenseNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {agent.email}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {agent.phone}
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Account Status</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verification:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  agent.verificationStatus === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {agent.verificationStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subscription:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  agent.subscriptionPlan === 'premium' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.subscriptionPlan}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-2">Listing Statistics</h5>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{agent.currentMonthListings}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{agent.listingLimits}</p>
                <p className="text-sm text-gray-600">Limit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((agent.currentMonthListings / agent.listingLimits) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Usage</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Edit Agent
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AgentModal;
