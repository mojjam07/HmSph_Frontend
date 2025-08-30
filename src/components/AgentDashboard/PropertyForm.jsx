import React from 'react';
import { X, Camera } from 'lucide-react';

const PropertyForm = ({
  isEditing,
  setShowAddProperty,
  setIsEditing,
  resetForm,
  propertyForm,
  setPropertyForm,
  selectedFiles,
  setSelectedFiles,
  uploadingImages,
  handleAddProperty,
  handleUpdateProperty
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Property' : 'Add New Property'}
        </h3>
        <button 
          onClick={() => {
            setShowAddProperty(false);
            setIsEditing(false);
            resetForm();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
            <input
              type="text"
              value={propertyForm.title}
              onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
              placeholder="Enter property title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select
              value={propertyForm.propertyType}
              onChange={(e) => setPropertyForm({...propertyForm, propertyType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="duplex">Duplex</option>
              <option value="bungalow">Bungalow</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={propertyForm.address}
              onChange={(e) => setPropertyForm({...propertyForm, address: e.target.value})}
              placeholder="Enter full address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
            <input
              type="text"
              value={propertyForm.area}
              onChange={(e) => setPropertyForm({...propertyForm, area: e.target.value})}
              placeholder="e.g., Lekki, VI, Ikeja"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={propertyForm.state}
              onChange={(e) => setPropertyForm({...propertyForm, state: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Rivers">Rivers</option>
              <option value="Ogun">Ogun</option>
            </select>
          </div>
        </div>

        {/* Price and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
            <input
              type="number"
              value={propertyForm.price}
              onChange={(e) => setPropertyForm({...propertyForm, price: e.target.value})}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
            <input
              type="number"
              value={propertyForm.bedrooms}
              onChange={(e) => setPropertyForm({...propertyForm, bedrooms: e.target.value})}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
            <input
              type="number"
              value={propertyForm.bathrooms}
              onChange={(e) => setPropertyForm({...propertyForm, bathrooms: e.target.value})}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <input
              type="text"
              value={propertyForm.size}
              onChange={(e) => setPropertyForm({...propertyForm, size: e.target.value})}
              placeholder="e.g., 450sqm"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={propertyForm.description}
            onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
            placeholder="Describe the property features, amenities, and unique selling points..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
            >
              {uploadingImages ? 'Uploading...' : 'Choose Files'}
            </label>
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={propertyForm.status}
            onChange={(e) => setPropertyForm({...propertyForm, status: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end p-6 border-t border-gray-200">
        <button
          onClick={isEditing ? handleUpdateProperty : handleAddProperty}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </div>
  </div>
);

export default PropertyForm;
