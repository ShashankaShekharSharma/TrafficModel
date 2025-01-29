import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, Building, MessageSquare } from 'lucide-react';

function ScheduleDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    participants: '1-5',
    date: '',
    time: '',
    interests: [],
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for scheduling a demo! We will contact you shortly to confirm your appointment.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 sm:p-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Schedule a Demo
            </h1>
            <p className="text-gray-400 mb-8">
              Experience our smart traffic management solutions in action
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Ltd."
                  />
                </div>
                <div>
                  <label htmlFor="participants" className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Participants
                  </label>
                  <select
                    id="participants"
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-5">1-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="11-20">11-20 people</option>
                    <option value="20+">20+ people</option>
                  </select>
                </div>
              </div>

              {/* Demo Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Areas of Interest
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="interests"
                      value="traffic"
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-gray-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Smart Traffic Light Management</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="interests"
                      value="fire"
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-gray-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Fire Detection</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="interests"
                      value="wanted"
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-gray-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Wanted Person Detection</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="interests"
                      value="plate"
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-gray-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Number Plate Detection</span>
                  </label>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any specific requirements or questions?"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  Schedule Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDemo;