import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h3>
        <p className="text-lg text-gray-600 mb-8">
          Get the latest property listings and market insights delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
