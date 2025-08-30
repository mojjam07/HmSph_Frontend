import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of satisfied customers who found their perfect property with HomeSphere. 
            Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-900 transition-all transform hover:scale-105">
              Become an Agent
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
