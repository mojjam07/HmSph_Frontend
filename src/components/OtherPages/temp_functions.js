  const handleWriteReview = () => {
    if (!user) {
      alert('Please login to write a review');
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    fetchReviews(); // Refresh reviews after submission
  };
