import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function TermsOfService() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="prose prose-invert max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">1. Acceptance of Terms</h2>
            <p className="text-gray-400 mb-4">
              By accessing and using LocalHost:8080 Group's smart traffic management solutions, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">2. Use License</h2>
            <p className="text-gray-400 mb-4">
              We grant you a limited, non-exclusive, non-transferable license to use our services subject to these terms:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Use the service as intended for traffic management purposes</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not attempt to reverse engineer or modify the system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">3. Service Availability and Updates</h2>
            <p className="text-gray-400 mb-4">
              We strive to provide uninterrupted service but may need to perform maintenance or updates:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>We reserve the right to modify or discontinue services with notice</li>
              <li>System updates may be required for security and functionality</li>
              <li>We are not liable for any service interruptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">4. Data Collection and Usage</h2>
            <p className="text-gray-400 mb-4">
              Our services collect and process traffic-related data:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Traffic flow and pattern analysis</li>
              <li>System performance metrics</li>
              <li>User interaction data</li>
              <li>Compliance with privacy laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">5. Limitation of Liability</h2>
            <p className="text-gray-400 mb-4">
              LocalHost:8080 Group shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Indirect or consequential damages</li>
              <li>Service interruptions or data loss</li>
              <li>Third-party actions or systems</li>
              <li>Force majeure events</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">6. Contact Information</h2>
            <p className="text-gray-400">
              For questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@localhost8080.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;