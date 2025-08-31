import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Search,
  CheckCircle,
  Shield,
  Users,
  Award,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '../../api/reviews';
import Navigation from '../LandingPage/Navigation';
import Footer from '../LandingPage/Footer';
import ReviewModal from './ReviewModal';

const Reviews = ({ token: propToken, user: propUser, onLogout: propOnLogout }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { user: authUser, token: authToken, logout: authLogout } = useAuth();

  // Use props if provided, otherwise fall back to useAuth
  const user = propUser || authUser;
  const token = propToken || authToken;
  const onLogout = propOnLogout || authLogout;

  // Calculate review statistics
  const reviewStats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 4.8,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await reviewsAPI.getReviews();
      console.log('Reviews data received:', data);

      // Ensure data is an array
      const reviewsArray = Array.isArray(data) ? data : data.reviews || [];
      setReviews(reviewsArray);
    } catch (err) {
      console.error('Error fetching reviews:', err);

      // Provide more specific error messages
      let errorMessage = 'Failed to load reviews';

      if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message.includes('401')) {
        errorMessage = 'Authentication required. Please login to view reviews.';
      } else if (err.message.includes('404')) {
        errorMessage = 'Reviews service not found. Please try again later.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error. Our team has been notified.';
      } else {
        errorMessage = err.message || 'Failed to load reviews. Please try again later.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reviewId) => {
    if (!token) {
      alert('Please login to like reviews');
      return;
    }

    try {
      await reviewsAPI.likeReview(reviewId);
      fetchReviews(); // Refresh reviews after liking
    } catch (err) {
      console.error('Error liking review:', err);
      alert('Failed to like review. Please try again.');
    }
  };

  const handleDislike = async (reviewId) => {
    if (!token) {
      alert('Please login to dislike reviews');
      return;
    }

    try {
      await reviewsAPI.dislikeReview(reviewId);
      fetchReviews(); // Refresh reviews after disliking
    } catch (err) {
      console.error('Error disliking review:', err);
      alert('Failed to dislike review. Please try again.');
    }
  };

  const handleWriteReview = () => {
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    fetchReviews(); // Refresh reviews after submission
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];

    // Apply rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Apply legacy filter (for backward compatibility)
    if (filter === 'positive') {
      filtered = filtered.filter(review => review.rating >= 4);
    } else if (filter === 'negative') {
      filtered = filtered.filter(review => review.rating <= 2);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.User?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.Property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highest':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return filtered.sort((a, b) => a.rating - b.rating);
      default:
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filteredReviews = getFilteredReviews();

  const getRatingPercentage = (rating) => {
    const total = Object.values(reviewStats.ratingDistribution).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;
    return Math.round((reviewStats.ratingDistribution[rating] / total) * 100);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation onShowRegistration={() => {}} onShowLogin={() => {}} token={token} user={user} onLogout={onLogout} />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 text-white">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative min-h-[60vh] flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Reviews from <span className="text-yellow-400">Our People</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Discover what our community says about their experiences
              </p>
            </div>
          </div>
        </section>

        {/* Error Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mb-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-600 text-xl font-medium mb-2">Unable to load reviews</div>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchReviews}
                className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </section>

        <Footer />

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          propertyId="sample-property-id"
          propertyTitle="Sample Property"
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onShowRegistration={() => {}} onShowLogin={() => {}} token={token} user={user} onLogout={onLogout} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative min-h-[60vh] flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Reviews from <span className="text-yellow-400">Our People</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover what our community says about their experiences
            </p>

            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl mx-auto">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {reviewStats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(s => (
                  <Star
                    key={s}
                    className={`h-6 w-6 ${s <= Math.round(reviewStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviewStats.totalReviews} reviews</p>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6">Rating Distribution</h3>
              <div className="space-y-2">
                {[5,4,3,2,1].map(rating => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                        style={{width: `${getRatingPercentage(rating)}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {reviewStats.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Reviews</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover what makes our community special
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {reviews.filter(r => r.rating >= 4).slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">{review.User?.name || review.userName || 'Anonymous User'}</h4>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic">
                    "{review.comment?.substring(0, 100)}..."
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Reviews Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div className="flex items-center space-x-1 mb-6 lg:mb-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setFilter('positive')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'positive'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Positive ({reviews.filter(r => r.rating >= 4).length})
              </button>
              <button
                onClick={() => setFilter('negative')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'negative'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Negative ({reviews.filter(r => r.rating <= 2).length})
              </button>
            </div>

            {user && (
              <Link
                onClick={handleWriteReview}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
              >
                Write a Review
              </Link>
            )}
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Ratings</option>
                {[5,4,3,2,1].map(r => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>

              <div className="text-sm text-gray-500 flex items-center">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid gap-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' :
                   filter === 'all' ? 'Be the first to write a review!' :
                   `No ${filter} reviews found. Try a different filter.`}
                </p>
                {user && (
                  <Link
                    onClick={handleWriteReview}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Write a Review
                  </Link>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {review.User?.name || review.userName || 'Anonymous User'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500 font-medium">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                  {review.Property && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500">Property: </span>
                      <Link
                        to={`/properties/${review.Property.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {review.Property.title}
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(review.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-colors"
                      disabled={!token}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-medium">{review.likes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(review.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors"
                      disabled={!token}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="font-medium">{review.dislikes || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trust & Safety</h2>
            <p className="text-xl text-gray-600">We ensure all reviews are authentic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: 'Verified Reviews', color: 'green', description: 'All reviews are from verified users' },
              { icon: Shield, title: '24/7 Moderation', color: 'blue', description: 'Round-the-clock content monitoring' },
              { icon: Users, title: 'Community Guidelines', color: 'purple', description: 'Clear rules for fair reviews' },
              { icon: Award, title: 'Quality Assurance', color: 'yellow', description: 'High standards for all content' }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Share Your Experience</h2>
          <p className="text-xl mb-8">Help others make informed decisions</p>
          {user ? (
            <Link
              onClick={handleWriteReview}
              className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              Write a Review
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              Login to Write a Review
            </Link>
          )}
        </div>
      </section>

      <Footer />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        propertyId="sample-property-id"
        propertyTitle="Sample Property"
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default Reviews;
