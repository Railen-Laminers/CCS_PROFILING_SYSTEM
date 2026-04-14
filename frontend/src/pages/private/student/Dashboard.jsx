import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiGrid, 
  FiUser, 
  FiBook, 
  FiHeart, 
  FiAward, 
  FiUsers, 
  FiAlertTriangle, 
  FiCalendar, 
  FiBell, 
  FiMoon,
  FiSun,
  FiInfo, 
  FiCheckCircle,
  FiSave,
  FiArrowLeft
} from 'react-icons/fi';

const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    studentId: '',
    gender: '',
    birthdate: '',
    contactNumber: '',
    email: '',
    address: '',
    guardianName: '',
    emergencyContact: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      {/* Back Link */}
      <button 
        onClick={() => setActiveView('dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-2 mb-6">
        <FiUser className="w-5 h-5 text-[#FF6B00]" />
        <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">First Name *</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Middle Name</label>
            <input 
              type="text" 
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="Enter middle name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Last Name *</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Student ID *</label>
            <input 
              type="text" 
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="Enter student ID"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Gender *</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Birthdate *</label>
            <input 
              type="date" 
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Contact Number *</label>
            <input 
              type="tel" 
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="+63 XXX XXX XXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Email Address *</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
            placeholder="student@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Complete Address *</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all resize-none"
            placeholder="Street, Barangay, City, Province, Zip Code"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Parent/Guardian Name *</label>
            <input 
              type="text" 
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="Enter parent/guardian name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Emergency Contact Number *</label>
            <input 
              type="tel" 
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:bg-white transition-all"
              placeholder="+63 XXX XXX XXXX"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            Save Information
          </button>
        </div>
      </form>
    </div>
  );
};

const AcademicPerformanceForm = () => {
  const [subjects, setSubjects] = useState(['']);
  const [awards, setAwards] = useState(['']);
  const [participations, setParticipations] = useState([{ type: '', event: '', year: '' }]);

  const addSubject = () => setSubjects([...subjects, '']);
  const addAward = () => setAwards([...awards, '']);
  const addParticipation = () => setParticipations([...participations, { type: '', event: '', year: '' }]);

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-800">Academic Performance</h2>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Course/Program *</label>
                <input 
                  type="text" 
                  className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                  placeholder="Enter course/program"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Year Level *</label>
                <select className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all">
                  <option value="">Select year level</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">GPA *</label>
              <input 
                type="text" 
                className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                placeholder="e.g., 3.75"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Current Subjects</label>
              <div className="space-y-2">
                {subjects.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Enter subject name"
                    />
                    <button type="button" className="w-10 h-10 bg-[#FF6B00] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Academic Awards</label>
              <div className="space-y-2">
                {awards.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Enter award"
                    />
                    <button type="button" className="w-10 h-10 bg-[#FF6B00] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Academic Participation (Competitions, Quiz Bees, etc.)</label>
              <div className="space-y-2">
                {participations.map((_, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <select className="bg-[#F1F5F9] rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all">
                      <option value="">Type</option>
                      <option value="competition">Competition</option>
                      <option value="quizbee">Quiz Bee</option>
                      <option value="others">Others</option>
                    </select>
                    <input 
                      type="text" 
                      className="bg-[#F1F5F9] rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Event name"
                    />
                    <input 
                      type="text" 
                      className="bg-[#F1F5F9] rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Year"
                    />
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addParticipation}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Participation
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MedicalRecordsForm = () => {
  const [allergies, setAllergies] = useState(['']);
  const [conditions, setConditions] = useState(['']);
  const [disabilities, setDisabilities] = useState(['']);

  const addAllergy = () => setAllergies([...allergies, '']);
  const addCondition = () => setConditions([...conditions, '']);
  const addDisability = () => setDisabilities([...disabilities, '']);

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <svg className="w-5 h-5 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-800">Medical Records</h2>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Blood Type *</label>
              <div className="relative">
                <select className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all">
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Allergies</label>
              <div className="space-y-2">
                {allergies.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Enter allergy (e.g., Peanuts, Penicillin)"
                    />
                    <button type="button" className="w-10 h-10 bg-[#FF6B00] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">No allergies recorded</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Medical Conditions</label>
              <div className="space-y-2">
                {conditions.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Enter medical condition (e.g., Asthma, Diabetes)"
                    />
                    <button type="button" className="w-10 h-10 bg-[#FF6B00] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">No medical conditions recorded</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Disabilities (if any)</label>
              <div className="space-y-2">
                {disabilities.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                      placeholder="Enter disability or special needs"
                    />
                    <button type="button" className="w-10 h-10 bg-[#FF6B00] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">No disabilities recorded</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SportsActivitiesForm = () => {
  const activities = [
    'Basketball', 'Volleyball', 'Programming', 'Quiz Bee', 'Chess', 'Football/Soccer', 
    'Swimming', 'Track and Field', 'Badminton', 'Table Tennis', 'Dance', 'Music/Band', 
    'Art/Painting', 'Drama/Theater', 'Debate', 'Robotics', 'Science Club', 'Math Club', 
    'Writing/Journalism', 'Photography', 'Coding Club', 'Student Council', 'Environmental Club', 
    'Taekwondo/Martial Arts', 'Baseball', 'Tennis', 'Cheerleading', 'Choir/Singing', 
    'Gaming/Esports', 'Cooking/Culinary', 'Gardening', 'Archery', 'Cycling', 'Skateboarding', 'Yoga/Fitness'
  ];

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [customActivities, setCustomActivities] = useState([]);
  const [customForm, setCustomForm] = useState({ name: '', years: '', achievements: '' });

  const toggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const addCustomActivity = () => {
    if (customForm.name) {
      setCustomActivities([...customActivities, customForm]);
      setCustomForm({ name: '', years: '', achievements: '' });
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FiAward className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="text-lg font-bold text-gray-800">Sports & Activities</h2>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Select Your Interests</label>
              <p className="text-xs text-gray-500 mb-4">Click on activities you're interested in or participating in</p>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleActivity(activity)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      selectedActivities.includes(activity)
                        ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-600 text-sm font-medium hover:border-gray-400 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Other
                </button>
              </div>
            </div>

            <div className="border border-dashed border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-bold text-gray-800 mb-2">Add Custom Activity</label>
              <p className="text-xs text-gray-500 mb-4">Can't find your activity above? Add it here with details</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Sport/Activity Name *</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                    placeholder="e.g., Basketball, Swimming"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({...customForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Years Active</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                    placeholder="e.g., 2020-2026"
                    value={customForm.years}
                    onChange={(e) => setCustomForm({...customForm, years: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Achievements & Awards</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                    placeholder="Enter achievement or award"
                    value={customForm.achievements}
                    onChange={(e) => setCustomForm({...customForm, achievements: e.target.value})}
                  />
                  <button type="button" className="w-10 h-10 bg-[#FF6B00] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <button 
                type="button"
                onClick={addCustomActivity}
                className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Activity
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const OrganizationsForm = () => {
  const [organizations, setOrganizations] = useState([]);
  const [orgForm, setOrgForm] = useState({ name: '', position: '', years: '', role: '' });

  const addOrganization = () => {
    if (orgForm.name) {
      setOrganizations([...organizations, orgForm]);
      setOrgForm({ name: '', position: '', years: '', role: '' });
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <FiUsers className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="text-lg font-bold text-gray-800">Organizations & Leadership</h2>
          </div>

          <form className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6">
              <label className="block text-sm font-bold text-gray-800 mb-4">Add New Organization</label>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Organization Name *</label>
                <input 
                  type="text" 
                  className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                  placeholder="Select or type organization"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({...orgForm, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Position</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                    placeholder="e.g., Member, Officer"
                    value={orgForm.position}
                    onChange={(e) => setOrgForm({...orgForm, position: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Years Active</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                    placeholder="e.g., 2024-2026"
                    value={orgForm.years}
                    onChange={(e) => setOrgForm({...orgForm, years: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Leadership Role (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                  placeholder="e.g., President, Vice President, Committee Head"
                  value={orgForm.role}
                  onChange={(e) => setOrgForm({...orgForm, role: e.target.value})}
                />
              </div>

              <button 
                type="button"
                onClick={addOrganization}
                className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Organization
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const BehaviorRecordsForm = () => {
  const [activeTab, setActiveTab] = useState('warnings');
  const [warnings, setWarnings] = useState([]);
  const [warningForm, setWarningForm] = useState({ date: '', reason: '' });

  const addWarning = () => {
    if (warningForm.date && warningForm.reason) {
      setWarnings([...warnings, warningForm]);
      setWarningForm({ date: '', reason: '' });
    }
  };

  const tabs = ['Warnings', 'Suspensions', 'Counseling', 'Incidents'];

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <FiAlertTriangle className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="text-lg font-bold text-gray-800">Behavior & Discipline Records</h2>
          </div>

          {/* Clean Record Status */}
          <div className="flex flex-col items-center justify-center py-8 mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Clean Record</h3>
            <p className="text-gray-500 text-sm">No behavioral incidents or disciplinary actions recorded</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#F1F5F9] rounded-lg p-1 mb-6 flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Add Warning Section */}
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 mb-6">
            <label className="block text-sm font-bold text-gray-800 mb-4">Add Warning</label>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                    value={warningForm.date}
                    onChange={(e) => setWarningForm({...warningForm, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Reason</label>
                <input 
                  type="text" 
                  className="w-full bg-[#F1F5F9] rounded-lg px-4 py-2.5 text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                  placeholder="Reason"
                  value={warningForm.reason}
                  onChange={(e) => setWarningForm({...warningForm, reason: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={addWarning}
              className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Warning
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsForm = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All Events', 'Events', 'Competitions'];

  const events = [
    {
      title: 'Tech Summit 2026',
      category: 'Conference',
      date: 'Monday, April 20, 2026',
      description: 'Annual technology conference featuring industry experts and networking opportunities.',
      color: 'bg-gray-100'
    },
    {
      title: 'AI & Machine Learning Workshop',
      category: 'Workshop',
      date: 'Saturday, April 25, 2026',
      description: 'Hands-on workshop covering modern AI and ML frameworks and best practices.',
      color: 'bg-blue-100'
    },
    {
      title: 'Career Fair 2026',
      category: 'Career',
      date: 'Thursday, April 30, 2026',
      description: 'Connect with top employers and explore career opportunities in the tech industry.',
      color: 'bg-purple-100'
    },
    {
      title: 'Cybersecurity Awareness Seminar',
      category: 'Seminar',
      date: 'Saturday, April 18, 2026',
      description: 'Learn about the latest cybersecurity threats and how to protect yourself online.',
      color: 'bg-orange-100'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'events') return matchesSearch && !['Competition'].includes(event.category);
    if (activeCategory === 'competitions') return matchesSearch && event.category === 'Competition';
    return matchesSearch;
  });

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Events & Competitions</h1>
          <p className="text-gray-500">Browse and register for upcoming school events, competitions, and activities</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                className="w-full bg-[#F1F5F9] rounded-lg pl-12 pr-4 py-2.5 text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:bg-white transition-all"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-gray-500 text-sm">0 Registered</span>
            </div>
          </div>

          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category.toLowerCase().replace(' ', ''))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.toLowerCase().replace(' ', '')
                    ? 'bg-gray-800 text-white'
                    : 'bg-[#F1F5F9] text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{event.category}</span>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date}
              </div>
              <p className="text-gray-400 text-sm mb-4">{event.description}</p>
              <button className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-orange-600">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GraduationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path fillRule="evenodd" d="M12 2.25c-3.503 0-6.47.934-8.643 2.535l1.488-1.488a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.992 1.992a.75.75 0 001.06 0l1.992-1.992a.75.75 0 011.06 0l1.488 1.488C17.63 3.17 15.37 2.25 12 2.25zM7.5 7.547c0-.862.377-1.635 1.047-2.185a4.477 4.477 0 016.906 0c.67.55 1.047 1.323 1.047 2.185v.994c0 2.69-1.603 4.872-3.914 5.786l-.36.264a.75.75 0 01-.732.002l-.36-.264C9.103 13.413 7.5 11.231 7.5 8.541v-.994z" clipRule="evenodd" />
    <path d="M7.5 9c0-2.69 1.603-4.872 3.914-5.786l.36-.264a.75.75 0 01.732-.002l.36.264C14.397 4.128 16 6.31 16 9v.994c0 .862-.377 1.635-1.047 2.185a4.477 4.477 0 01-6.906 0c-.67-.55-1.047-1.323-1.047-2.185V9z" />
  </svg>
);

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { logoUrl, systemTitle, theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  const profileSections = [
    { title: 'Personal Information', icon: FiUser, status: 'not completed', view: 'personal' },
    { title: 'Academic', icon: FiBook, status: 'not completed', view: 'academic' },
    { title: 'Medical', icon: FiHeart, status: 'not completed', view: 'medical' },
    { title: 'Sports & Activities', icon: FiAward, status: 'not completed', view: 'sports' },
    { title: 'Organizations', icon: FiUsers, status: 'not completed', view: 'organizations' },
    { title: 'Behavior Records', icon: FiAlertTriangle, status: 'completed', view: 'behavior' }
  ];

  const sidebarItems = [
    { title: 'Dashboard', icon: FiGrid, view: 'dashboard' },
    { title: 'Personal Info', icon: FiUser, view: 'personal' },
    { title: 'Academic', icon: FiBook, view: 'academic' },
    { title: 'Medical', icon: FiHeart, view: 'medical' },
    { title: 'Sports & Activities', icon: FiAward, view: 'sports' },
    { title: 'Organizations', icon: FiUsers, view: 'organizations' },
    { title: 'Behavior', icon: FiAlertTriangle, view: 'behavior' },
    { title: 'Events & Competitions', icon: FiCalendar, view: 'events' }
  ];

  const upcomingEvents = [
    { title: 'National Programming Competition', category: 'Programming' },
    { title: 'Tech Summit 2026', category: 'Conference' }
  ];

return (
    <div className="p-8">
      {activeView === 'dashboard' && (
        <div className="profile-overview">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              {profileSections.map((section, index) => (
                <div 
                  key={index}
                  onClick={() => section.view && setActiveView(section.view)}
                  className={`bg-white rounded-xl border border-gray-100 shadow-sm border-l-[3px] border-l-[#FF6B00] p-5 ${section.view ? 'cursor-pointer hover:shadow-md' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <section.icon className="w-6 h-6 text-[#FF6B00]" />
                    {section.status === 'completed' ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <FiInfo className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">{section.title}</h3>
                  <p className="text-xs text-gray-400">
                    {section.status === 'completed' ? 'Information available' : 'Not completed'}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Upcoming Events</h2>
                <Link to="/student/my-events" className="text-sm text-[#FF6B00] hover:text-orange-700 font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">{event.category}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiCheckCircle className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="font-semibold text-gray-800">My Registrations</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-800 text-sm mb-3 text-center">You haven't registered for any events yet</p>
                <Link 
                  to="/student/my-events"
                  className="px-4 py-2 border border-gray-800 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'personal' && <PersonalInfoForm />}
      {activeView === 'academic' && <AcademicPerformanceForm />}
      {activeView === 'medical' && <MedicalRecordsForm />}
      {activeView === 'sports' && <SportsActivitiesForm />}
      {activeView === 'organizations' && <OrganizationsForm />}
      {activeView === 'behavior' && <BehaviorRecordsForm />}
      {activeView === 'events' && <EventsForm />}
      
      {activeView !== 'dashboard' && activeView !== 'personal' && activeView !== 'academic' && activeView !== 'medical' && activeView !== 'sports' && activeView !== 'organizations' && activeView !== 'behavior' && activeView !== 'events' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {activeView === 'medical' && 'Medical Information'}
            {activeView === 'sports' && 'Sports & Activities'}
            {activeView === 'organizations' && 'Organizations'}
            {activeView === 'behavior' && 'Behavior Records'}
            {activeView === 'events' && 'Events & Competitions'}
          </h2>
          <p className="text-gray-500">This section is coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;