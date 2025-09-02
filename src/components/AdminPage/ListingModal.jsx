import React, { useState, useEffect } from 'react';
import { X, MapPin, Camera, Video, Eye, MessageSquare, Edit3 } from 'lucide-react';
import Dropdown from '../common/Dropdown';

const ListingModal = ({ listing, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(!listing);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    images: []
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        propertyType: listing.propertyType || '',
        address: listing.address || '',
        city: listing.city || '',
        state: listing.state || '',
        zipCode: listing.zipCode || '',
        bedrooms: listing.bedrooms || '',
        bathrooms: listing.bathrooms || '',
        squareFootage: listing.squareFootage || '',
        images: listing.images || []
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{listing ? 'Edit Listing' : 'Add Listing'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              rows={3}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
            <Dropdown
              options={[
                { value: '', label: 'Select Property Type' },
                { value: 'HOUSE', label: 'House' },
                { value: 'APARTMENT', label: 'Apartment' },
                { value: 'CONDO', label: 'Condo' },
                { value: 'TOWNHOUSE', label: 'Townhouse' },
                { value: 'LAND', label: 'Land' },
                { value: 'COMMERCIAL', label: 'Commercial' }
              ]}
              value={formData.propertyType}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
              className="w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                name="bedrooms"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="number"
                step="0.5"
                name="bathrooms"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="number"
                name="squareFootage"
                placeholder="Square Footage"
                value={formData.squareFootage}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <div className="mt-2 flex space-x-2 overflow-x-auto">
                {formData.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`preview-${idx}`} className="h-16 w-16 object-cover rounded" />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
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
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Listing Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img 
              src={listing.images && listing.images.length > 0 ? listing.images[0] : ''}
              alt={listing.title || 'Listing Image'}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{listing.title || ''}</h4>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₦{listing.price ? listing.price.toLocaleString() : ''}
                </p>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{listing.address || ''}</span>
              </div>

              <p className="text-gray-700">{listing.description || ''}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{listing.bedrooms || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{listing.bathrooms || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking:</span>
                  <span className="font-medium">{listing.parking || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{listing.squareFootage || ''}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Status & Promotion</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status || ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Featured:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.isFeatured 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.isFeatured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Promoted:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.isPromoted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.isPromoted ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Analytics</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{listing.analytics?.views || 0}</p>
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{listing.analytics?.inquiries || 0}</p>
                    <p className="text-sm text-gray-600">Inquiries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{listing.analytics?.favorites || 0}</p>
                    <p className="text-sm text-gray-600">Favorites</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Media</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Camera className="h-4 w-4 mr-2" />
                    <span>Images</span>
                  </div>
                  <span className="text-sm font-medium">{listing.images?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Video className="h-4 w-4 mr-2" />
                    <span>Videos</span>
                  </div>
                  <span className="text-sm font-medium">{listing.videos?.length || 0}</span>
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
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Edit Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
