import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, Car, Shield, ChevronRight } from 'lucide-react';

function HomePage() {
  const [activeVideo, setActiveVideo] = useState('traffic');

  const solutions = [
    {
      id: 'traffic',
      title: 'Smart Traffic Light Management',
      description: 'AI-powered traffic light control system that adapts to real-time traffic conditions, reducing congestion and improving traffic flow by up to 40%.',
      video: 'https://youtu.be/pQaG0ay957M?si=AypT38OYepbkmeBq',
      icon: <Activity className="w-8 h-8 text-emerald-500" />,
      color: 'emerald'
    },
    {
      id: 'fire',
      title: 'Fire Detection',
      description: 'Advanced thermal imaging and AI algorithms for early fire detection in traffic infrastructure, enabling rapid emergency response.',
      video: 'https://www.youtube.com/embed/6LC_Ur4L3GM',
      icon: <AlertTriangle className="w-8 h-8 text-rose-500" />,
      color: 'rose'
    },
    {
      id: 'wanted',
      title: 'Wanted Person Detection',
      description: 'State-of-the-art facial recognition system integrated with law enforcement databases for real-time identification of persons of interest.',
      video: 'https://youtu.be/VOTZ0k2LZUg?si=sq5bzupliolxC2sa',
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      color: 'blue'
    },
    {
      id: 'plate',
      title: 'Number Plate Detection',
      description: 'High-accuracy ANPR system capable of reading and processing vehicle number plates in real-time, supporting law enforcement and traffic monitoring.',
      video: 'https://www.youtube.com/embed/0xqPC_k7FZk',
      icon: <Car className="w-8 h-8 text-violet-500" />,
      color: 'violet'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Smart Traffic Management Solutions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
              Revolutionizing urban mobility with cutting-edge AI technology and real-time analytics
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Video Player */}
            <div className="sticky top-8">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-1 rounded-2xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-[400px] rounded-xl"
                    src={solutions.find(s => s.id === activeVideo)?.video}
                    title="Smart Traffic Management System"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Solutions List */}
            <div className="space-y-6">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className={`bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-1 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                    activeVideo === solution.id ? `ring-2 ring-${solution.color}-500` : ''
                  }`}
                  onClick={() => setActiveVideo(solution.id)}
                >
                  <div className="bg-slate-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {solution.icon}
                        <h3 className="text-xl font-semibold text-white">{solution.title}</h3>
                      </div>
                      <ChevronRight className={`w-6 h-6 text-${solution.color}-500 transform transition-transform duration-300 ${
                        activeVideo === solution.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                    <p className={`mt-4 text-gray-400 ${activeVideo === solution.id ? 'block' : 'hidden'}`}>
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Transform Your City's Traffic Management
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the future of urban mobility with our cutting-edge solutions
          </p>
          <Link 
            to="/schedule-demo"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-500">© 2024 LocalHost:8080 Group. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-gray-300 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;