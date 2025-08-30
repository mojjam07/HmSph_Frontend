import React, { useState, useEffect } from 'react';
import Navigation from '../LandingPage/Navigation';
import Footer from '../LandingPage/Footer';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle,
  MessageSquare, Headphones, Building, Users,
  AlertCircle, Loader
} from 'lucide-react';
import { apiRequest } from '../../api/utils.js';

const ContactPage = ({ onLogin, token, user, onLogout }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [contactInfo, setContactInfo] = useState(null);
  // const [loading, setLoading] = useState(true);

  // Fetch contact information from backend
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const data = await apiRequest('/api/contact/info');
      setContactInfo(data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setContactInfo(getDefaultContactInfo());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContactInfo = () => [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: [
        "123 Victoria Island Road",
        "Lagos Island, Lagos State",
        "Nigeria"
      ],
      color: "blue"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "+234 803 123 4567",
        "+234 806 789 0123",
        "Mon - Fri: 8AM - 6PM"
      ],
      color: "green"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "info@homesphere.com",
        "support@homesphere.com",
        "careers@homesphere.com"
      ],
      color: "purple"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8AM - 6PM",
        "Saturday: 9AM - 4PM",
        "Sunday: Closed"
      ],
      color: "orange"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = await apiRequest('/api/contact/submit', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null
        })
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Track contact form submission (if you have analytics)
      if (window.gtag) {
        window.gtag('event', 'contact_form_submit', {
          event_category: 'engagement',
          event_label: formData.inquiryType
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportAction = async (actionType) => {
    try {
      // Track support action
      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          event: 'support_action_clicked',
          data: { actionType, userId: user?.id || null }
        })
      });

      // Handle different actions
      switch (actionType) {
        case 'chat':
          // Open chat widget or redirect to chat page
          window.open('/chat', '_blank');
          break;
        case 'phone':
          window.location.href = 'tel:+2348031234567';
          break;
        case 'email':
          window.location.href = 'mailto:support@homesphere.com';
          break;
        case 'meeting':
          // Redirect to booking page
          window.open('/book-meeting', '_blank');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error tracking support action:', error);
    }
  };

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      actionType: "chat",
      available: true
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Speak directly with our experts",
      action: "Call Now",
      actionType: "phone",
      available: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed questions",
      action: "Send Email",
      actionType: "email",
      available: true
    },
    {
      icon: Building,
      title: "Office Visit",
      description: "Schedule an in-person meeting",
      action: "Book Meeting",
      actionType: "meeting",
      available: true
    }
  ];

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Listings' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'careers', label: 'Careers' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
  //         <p className="text-gray-600">Loading contact information...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onShowRegistration={() => {}} onShowLogin={() => {}} token={token} user={user} onLogout={onLogout} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We're here to help you find your perfect property or answer any questions you may have
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8">
            {contactInfo?.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`p-3 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 ${getColorClasses(info.color)}`}>
                  <info.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {departments.map(dept => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Support Options */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
              <div className="space-y-4 mb-8">
                {supportOptions.map((option, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-xl mr-4">
                          <option.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{option.title}</h3>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSupportAction(option.actionType)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {option.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Find Us Here</h3>
                    <p className="text-gray-600">Victoria Island, Lagos</p>
                    <button 
                      onClick={() => window.open('https://maps.google.com/?q=Victoria+Island,+Lagos', '_blank')}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I list my property?</h3>
                <p className="text-gray-600">
                  You can list your property by creating an account and using our easy-to-use listing form. 
                  Our team will review and approve your listing within 24 hours.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">What are your service fees?</h3>
                <p className="text-gray-600">
                  Our fees vary depending on the service. Property listings start from 2.5% commission. 
                  Contact us for detailed pricing information.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Do you provide property management?</h3>
                <p className="text-gray-600">
                  Yes, we offer comprehensive property management services including tenant screening, 
                  rent collection, and property maintenance coordination.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How can I schedule a property viewing?</h3>
                <p className="text-gray-600">
                  You can schedule viewings directly through our platform or by contacting the listing agent. 
                  We also offer virtual tours for remote viewing.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">What locations do you cover?</h3>
                <p className="text-gray-600">
                  We currently operate in major Nigerian cities including Lagos, Abuja, Port Harcourt, 
                  and Kano, with plans to expand to more cities.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I become a partner agent?</h3>
                <p className="text-gray-600">
                  We welcome experienced real estate professionals. Apply through our careers page 
                  or contact our partnership team for more information.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button 
              onClick={() => handleSupportAction('email')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;