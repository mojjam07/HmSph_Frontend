import React from 'react';
import { Shield, Users, TrendingUp, Award } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HomeSphere?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive real estate solutions with cutting-edge technology and personalized service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: 'Verified Properties',
              description: 'All listings are thoroughly verified for authenticity and legal compliance.',
              color: 'blue'
            },
            {
              icon: Users,
              title: 'Expert Agents',
              description: 'Work with certified real estate professionals with proven track records.',
              color: 'green'
            },
            {
              icon: TrendingUp,
              title: 'Market Insights',
              description: 'Access real-time market data and property valuation insights.',
              color: 'purple'
            },
            {
              icon: Award,
              title: '24/7 Support',
              description: 'Round-the-clock customer support for all your real estate needs.',
              color: 'yellow'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
