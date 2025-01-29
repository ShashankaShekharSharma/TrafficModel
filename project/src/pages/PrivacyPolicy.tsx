import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="prose prose-invert max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">1. Information We Collect</h2>
            <p className="text-gray-400 mb-4">
              We collect information that you provide directly to us, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Contact information (name, email address, phone number)</li>
              <li>Traffic management system usage data</li>
              <li>Technical information about your devices and systems</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">2. How We Use Your Information</h2>
            <p className="text-gray-400 mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Improving and personalizing user experience</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Communicating with you about our services</li>
              <li>Ensuring the security and integrity of our systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">3. Data Security</h2>
            <p className="text-gray-400 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">4. Your Rights</h2>
            <p className="text-gray-400 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">5. Contact Us</h2>
            <p className="text-gray-400">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@localhost8080.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;