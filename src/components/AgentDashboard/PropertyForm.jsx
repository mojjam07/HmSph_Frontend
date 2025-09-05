import React, { useState, useEffect } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
import Dropdown from '../common/Dropdown';

const propertyTypeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' }
];

const stateOptions = [
  { value: 'Lagos', label: 'Lagos' },
  { value: 'Abuja', label: 'Abuja' },
  { value: 'Rivers', label: 'Rivers' },
  { value: 'Ogun', label: 'Ogun' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'inactive', label: 'Inactive' }
];

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
}) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  // Create image previews when files are selected
  useEffect(() => {
    if (selectedFiles.length > 0) {
      const previews = selectedFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previews).then(setImagePreviews);
    } else {
      setImagePreviews([]);
    }
  }, [selectedFiles]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  // Remove image from selection
  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  return (
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
            <Dropdown
              options={propertyTypeOptions}
              value={propertyForm.propertyType}
              onChange={(e) => setPropertyForm({...propertyForm, propertyType: e.target.value})}
              placeholder="Select property type"
              className="w-full"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={propertyForm.city}
              onChange={(e) => setPropertyForm({...propertyForm, city: e.target.value})}
              placeholder="e.g., Lagos, Abuja"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <Dropdown
              options={stateOptions}
              value={propertyForm.state}
              onChange={(e) => setPropertyForm({...propertyForm, state: e.target.value})}
              placeholder="Select state"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
            <input
              type="text"
              value={propertyForm.zipCode}
              onChange={(e) => setPropertyForm({...propertyForm, zipCode: e.target.value})}
              placeholder="e.g., 100001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
            <input
              type="number"
              value={propertyForm.squareFootage}
              onChange={(e) => setPropertyForm({...propertyForm, squareFootage: e.target.value})}
              placeholder="e.g., 450"
              min="0"
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
              onChange={handleFileSelect}
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

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <Dropdown
            options={statusOptions}
            value={propertyForm.status}
            onChange={(e) => setPropertyForm({...propertyForm, status: e.target.value})}
            placeholder="Select status"
            className="w-full"
          />
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
};

export default PropertyForm;
