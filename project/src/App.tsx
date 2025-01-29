import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Activity, AlertTriangle, Car, Shield, ChevronRight } from 'lucide-react';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import ScheduleDemo from './pages/ScheduleDemo';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/schedule-demo" element={<ScheduleDemo />} />
      </Routes>
    </div>
  );
}

export default App