import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Globe, Clock } from 'lucide-react';

function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Link 
        to="/" 
        className="absolute top-8 left-8 inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>

      <div className="w-full max-w-2xl">
        {/* Business Card */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="absolute top-2 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

          {/* Card Content */}
          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                LocalHost:8080 Group
              </h1>
              <p className="text-gray-400">Smart Traffic Management Solutions</p>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">LocalHost8080@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white">Silicon Valley, CA</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Business Hours</p>
                    <p className="text-white">Mon - Fri: 9AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex items-center justify-center space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <p className="text-gray-400">www.localhost8080.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;