import React from 'react';
import { Building, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">HomeSphere</h1>
                <p className="text-gray-400 text-sm">Premium Properties</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters 
              with verified properties across Nigeria.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <button key={index} className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-colors">
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <div className="space-y-3">
              {['About Us', 'Properties', 'Agents', 'Blog', 'Contact'].map((link) => (
                <a key={link} href="#" className="block text-gray-400 hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-400">+234-800-HomeSphere</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-400">info@homesphere.ng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 HomeSphere. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
