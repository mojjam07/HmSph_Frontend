import React, { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import ApiService from '../../api/ApiService';

const LeadsView = ({ leads, listings, agents }) => {
  const [contactsData, setContactsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use a placeholder since the contacts API isn't fully implemented
      // In a real implementation, this would call ApiService.getContacts()
      setContactsData([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+2348031234567',
          subject: 'Property Inquiry',
          message: 'I am interested in the 3-bedroom apartment in Lekki',
          inquiryType: 'sales',
          status: 'NEW',
          createdAt: new Date().toISOString(),
          propertyId: 1,
          agentId: 1
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+2348067890123',
          subject: 'General Inquiry',
          message: 'I need information about your services',
          inquiryType: 'general',
          status: 'CONTACTED',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          propertyId: null,
          agentId: null
        }
      ]);
    } catch (err) {
      console.error('Failed to load contacts:', err);
      setError('Failed to load contacts data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await ApiService.updateContactStatus(contactId, status);
      loadContacts(); // Refresh the list
    } catch (err) {
      console.error('Failed to update contact status:', err);
      setError('Failed to update contact status');
    }
  };

  const filteredContacts = contactsData.filter(contact => {
    if (statusFilter === 'all') return true;
    return contact.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={loadContacts}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquiry Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => {
                const property = listings.find(l => l.listingId === contact.propertyId);
                const agent = agents.find(a => a.agentId === contact.agentId);

                return (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {contact.inquiryType === 'sales' ? (
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        ) : (
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contact.subject}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.inquiryType} inquiry
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contact.inquiryType === 'sales'
                          ? 'bg-blue-100 text-blue-800'
                          : contact.inquiryType === 'support'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.inquiryType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange={(e) => handleUpdateContactStatus(contact.id, e.target.value)}
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-0 ${
                          contact.status === 'NEW'
                            ? 'bg-blue-100 text-blue-800'
                            : contact.status === 'CONTACTED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CONVERTED">Converted</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Contact
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsView;
