import React, { useState, useEffect } from 'react';
import { Star, Check, X } from 'lucide-react';
import reviewsAPI from '../../api/reviews';

const ReviewsView = ({ reviews, agents }) => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewsAPI.getReviews({
        page: 1,
        limit: 50
      });

      setReviewsData(response || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load reviews data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await reviewsAPI.approveReview(reviewId);
      loadReviews(); // Refresh the list
    } catch (err) {
      console.error('Failed to approve review:', err);
      setError('Failed to approve review');
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await reviewsAPI.rejectReview(reviewId);
      loadReviews(); // Refresh the list
    } catch (err) {
      console.error('Failed to reject review:', err);
      setError('Failed to reject review');
    }
  };

  const filteredReviews = reviewsData.filter(review => {
    if (statusFilter === 'all') return true;
    return review.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={loadReviews}
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
        <h2 className="text-2xl font-bold text-gray-900">Reviews Management</h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {filteredReviews.map((review) => {
            const agent = agents.find(a => a.agentId === review.property?.agentId);

            return (
              <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={agent?.profilePicture || '/api/placeholder/64/64'}
                      alt=""
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {agent?.firstName} {agent?.lastName}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      {review.property && (
                        <p className="text-sm text-gray-500 mt-1">
                          Property: {review.property.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : review.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.status}
                    </span>
                    {review.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveReview(review.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectReview(review.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewsView;
