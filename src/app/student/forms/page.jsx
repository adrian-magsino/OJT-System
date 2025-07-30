'use client';
import { useState } from 'react';

export default function Form2InfoSheet() {
  const [formData, setFormData] = useState({
    // Student Training Information
    studentName: '',
    studentNumber: '',
    studentEmail: '',
    studentContact: '',
    guardianName: '',
    guardianContact: '',
    guardianEmail: '',
    
    // HTE/IP Information for Recommendation Letter
    companyName: '',
    companyAddress: '',
    companyContact: '',
    companyEmail: '',
    representativeName: '',
    representativeTitle: '',
    representativePosition: '',
    
    // HTE/IP Information for Memorandum of Agreement
    mainSignatoryName: '',
    mainSignatoryTitle: '',
    mainSignatoryPosition: '',
    firstWitnessName: '',
    firstWitnessTitle: '',
    secondWitnessName: '',
    secondWitnessTitle: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Handle form submission here
  };

  const titleOptions = ['Mr.', 'Ms.', 'Dr.', 'Engr.', 'Arch.', 'Hon.'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Student Application Forms
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Training Information */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Student Training Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Number *
              </label>
              <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail Address *
              </label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="studentContact"
                value={formData.studentContact}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian Contact Number *
              </label>
              <input
                type="tel"
                name="guardianContact"
                value={formData.guardianContact}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent / Guardian E-mail Address *
              </label>
              <input
                type="email"
                name="guardianEmail"
                value={formData.guardianEmail}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </section>

        {/* HTE/IP Information for Recommendation Letter */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Host Training Establishment / Industry Partner (HTE/IP) - Recommendation Letter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTE / IP / Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="companyContact"
                value={formData.companyContact}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail Address *
              </label>
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representative Name *
              </label>
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representative Title *
              </label>
              <select
                name="representativeTitle"
                value={formData.representativeTitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation / Position *
              </label>
              <input
                type="text"
                name="representativePosition"
                value={formData.representativePosition}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>
        </section>

        {/* HTE/IP Information for Memorandum of Agreement */}
        <section className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">
            Host Training Establishment / Industry Partner (HTE/IP) - Memorandum of Agreement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Main Signatory *
              </label>
              <input
                type="text"
                name="mainSignatoryName"
                value={formData.mainSignatoryName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Signatory Title *
              </label>
              <select
                name="mainSignatoryTitle"
                value={formData.mainSignatoryTitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Signatory Position *
              </label>
              <input
                type="text"
                name="mainSignatoryPosition"
                value={formData.mainSignatoryPosition}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of First Witness *
              </label>
              <input
                type="text"
                name="firstWitnessName"
                value={formData.firstWitnessName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Witness Title *
              </label>
              <select
                name="firstWitnessTitle"
                value={formData.firstWitnessTitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Second Witness *
              </label>
              <input
                type="text"
                name="secondWitnessName"
                value={formData.secondWitnessName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Second Witness Title *
              </label>
              <select
                name="secondWitnessTitle"
                value={formData.secondWitnessTitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}