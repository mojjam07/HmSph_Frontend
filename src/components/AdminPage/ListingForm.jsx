import React, { useState, useEffect } from 'react';

const ListingForm = ({ listing, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    location: {
      address: '',
      area: ''
    },
    features: {
      bedrooms: '',
      bathrooms: '',
      parking: '',
      size: ''
    },
    status: 'active',
    isFeatured: false,
    isPromoted: false,
    images: []
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        propertyType: listing.propertyType || '',
        location: {
          address: listing.location?.address || '',
          area: listing.location?.area || ''
        },
        features: {
          bedrooms: listing.features?.bedrooms || '',
          bathrooms: listing.features?.bathrooms || '',
          parking: listing.features?.parking || '',
          size: listing.features?.size || ''
        },
        status: listing.status || 'active',
        isFeatured: listing.isFeatured || false,
        isPromoted: listing.isPromoted || false,
        images: listing.images || []
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value
        }
      }));
    } else if (name.startsWith('features.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [key]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{listing ? 'Edit Listing' : 'Add Listing'}</h3>
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
          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            value={formData.propertyType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="location.area"
            placeholder="Area"
            value={formData.location.area}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="features.bedrooms"
              placeholder="Bedrooms"
              value={formData.features.bedrooms}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
            <input
              type="number"
              name="features.bathrooms"
              placeholder="Bathrooms"
              value={formData.features.bathrooms}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
            <input
              type="number"
              name="features.parking"
              placeholder="Parking"
              value={formData.features.parking}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="features.size"
              placeholder="Size"
              value={formData.features.size}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">Featured</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isPromoted"
                checked={formData.isPromoted}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">Promoted</span>
            </label>
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

export default ListingForm;
