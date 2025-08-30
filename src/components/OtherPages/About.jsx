import React from 'react';
import Navigation from '../LandingPage/Navigation';
import Footer from '../LandingPage/Footer';
import { 
  Building, Users, Award, Target, Heart, Shield, 
  Zap, Globe, CheckCircle, ArrowRight, Star
} from 'lucide-react';

const AboutPage = ({ onLogin, token, user, onLogout }) => {
  const stats = [
    { icon: Building, value: "5,000+", label: "Properties Listed" },
    { icon: Users, value: "10,000+", label: "Happy Clients" },
    { icon: Award, value: "50+", label: "Expert Agents" },
    { icon: Globe, value: "25+", label: "Cities Covered" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We believe in complete transparency in all our dealings, ensuring our clients have all the information they need to make informed decisions."
    },
    {
      icon: Heart,
      title: "Client-Centric Approach",
      description: "Every client is unique, and we tailor our services to meet individual needs, preferences, and budgets."
    },
    {
      icon: Zap,
      title: "Innovation & Technology",
      description: "We leverage cutting-edge technology to provide seamless experiences and stay ahead in the digital real estate landscape."
    },
    {
      icon: Target,
      title: "Excellence in Service",
      description: "We strive for excellence in every interaction, ensuring the highest standards of professional service delivery."
    }
  ];

  const team = [
    {
      name: "David Okafor",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "With over 15 years in real estate, David founded HomeSphere to revolutionize property transactions in Nigeria."
    },
    {
      name: "Amina Hassan",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      bio: "Amina oversees our day-to-day operations and ensures seamless service delivery across all departments."
    },
    {
      name: "Chidi Okwu",
      role: "Technology Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      bio: "Chidi leads our tech innovation, developing platforms that make property search and transactions effortless."
    },
    {
      name: "Kemi Adebola",
      role: "Head of Sales",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      bio: "Kemi manages our sales team and works closely with clients to understand and fulfill their property needs."
    }
  ];

  const achievements = [
    "Best Real Estate Platform 2023 - Nigerian Property Awards",
    "Technology Innovation Award 2023 - PropTech Nigeria",
    "Customer Service Excellence Award 2022",
    "Fastest Growing Real Estate Company 2022",
    "Digital Transformation Award 2021"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation onShowRegistration={() => {}} onShowLogin={() => {}} token={token} user={user} onLogout={onLogout} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About HomeSphere</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Transforming the Nigerian real estate landscape with innovative solutions, 
              exceptional service, and unwavering commitment to our clients' success.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Founded in 2018, HomeSphere began with a simple vision: to make property 
                  transactions in Nigeria more transparent, efficient, and accessible to everyone. 
                  What started as a small team of passionate real estate professionals has grown 
                  into one of Nigeria's leading property platforms.
                </p>
                <p>
                  We recognized the challenges faced by both property seekers and sellers in 
                  the traditional real estate market - from lack of transparency to limited 
                  access to quality listings. Our mission became clear: leverage technology 
                  to bridge these gaps and create a seamless experience for all stakeholders.
                </p>
                <p>
                  Today, we're proud to have facilitated thousands of successful property 
                  transactions, helped families find their dream homes, and supported investors 
                  in building their portfolios. Our journey continues as we expand our reach 
                  and enhance our services.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Modern office building"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">6+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Driving our commitment to excellence and innovation in real estate
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-blue-100 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg">
                To democratize access to quality real estate opportunities across Nigeria 
                by providing a transparent, efficient, and technology-driven platform that 
                connects buyers, sellers, and renters with their perfect properties.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-purple-100 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg">
                To become Africa's leading real estate platform, setting the standard 
                for innovation, transparency, and customer satisfaction while contributing 
                to sustainable urban development across the continent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The visionary leaders driving HomeSphere's success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recognition for our commitment to excellence and innovation
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have found their perfect homes with HomeSphere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center">
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;