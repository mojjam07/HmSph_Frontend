import React, { useState, useEffect } from 'react';

const AgentForm = ({ agent, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    licenseNumber: '',
    verificationStatus: 'pending',
    subscriptionPlan: 'basic',
    profilePicture: ''
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        firstName: agent.firstName || '',
        lastName: agent.lastName || '',
        email: agent.email || '',
        phone: agent.phone || '',
        businessName: agent.businessName || '',
        licenseNumber: agent.licenseNumber || '',
        verificationStatus: agent.verificationStatus || 'pending',
        subscriptionPlan: agent.subscriptionPlan || 'basic',
        profilePicture: agent.profilePicture || ''
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{agent ? 'Edit Agent' : 'Add Agent'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <select
            name="verificationStatus"
            value={formData.verificationStatus}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            name="subscriptionPlan"
            value={formData.subscriptionPlan}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
          <input
            type="text"
            name="profilePicture"
            placeholder="Profile Picture URL"
            value={formData.profilePicture}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;
