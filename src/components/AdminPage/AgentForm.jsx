import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AgentForm = ({ agent, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    licenseNumber: '',
    verificationStatus: 'PENDING',
    subscriptionPlan: 'BASIC',
    profileImage: '',
    commissionRate: 0.03,
    specialties: [],
    bio: '',
    listingLimits: 25
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        firstName: agent.firstName || '',
        lastName: agent.lastName || '',
        email: agent.email || '',
        password: '', // Don't populate password for editing
        phone: agent.phone || '',
        businessName: agent.businessName || '',
        licenseNumber: agent.licenseNumber || '',
        verificationStatus: agent.verificationStatus || 'PENDING',
        subscriptionPlan: agent.subscriptionPlan || 'BASIC',
        profileImage: agent.profileImage || agent.profilePicture || '',
        commissionRate: agent.commissionRate || 0.03,
        specialties: agent.specialties || [],
        bio: agent.bio || '',
        listingLimits: agent.listingLimits || 25
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{agent ? 'Edit Agent' : 'Add Agent'}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required={!agent} // Only required for new agents
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
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <select
            name="subscriptionPlan"
            value={formData.subscriptionPlan}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="BASIC">Basic</option>
            <option value="PRO">Pro</option>
            <option value="PREMIUM">Premium</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
          <input
            type="text"
            name="profileImage"
            placeholder="Profile Image URL"
            value={formData.profileImage}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <input
            type="number"
            name="commissionRate"
            placeholder="Commission Rate (0.01 - 1.0)"
            value={formData.commissionRate}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="1"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="specialties"
            placeholder="Specialties (comma-separated)"
            value={Array.isArray(formData.specialties) ? formData.specialties.join(', ') : formData.specialties}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                specialties: value ? value.split(',').map(s => s.trim()) : []
              }));
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <input
            type="number"
            name="listingLimits"
            placeholder="Listing Limits"
            value={formData.listingLimits}
            onChange={handleChange}
            min="0"
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
