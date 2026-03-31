import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiBookOpen, 
  FiUsers, 
  FiFileText, 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiSearch,
  FiEye,
  FiSettings
} from 'react-icons/fi';

const Instruction = () => {
  const { primaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes] = useState([]);

  const tabs = ['Classes', 'Assignments', 'Lesson Plans', 'Course Materials'];

  const statCards = [
    { label: 'Active Classes', icon: FiBookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Total Students', icon: FiUsers, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Open Assignments', icon: FiFileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Lesson Plans', icon: FiCalendar, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const filteredClasses = classes.filter(cls => 
    cls.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Instruction Management</h1>
          <p className="text-gray-500 mt-1">Manage classes, assignments, and course materials</p>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">0</p>
                <p className="text-gray-500 mt-1">{card.label}</p>
              </div>
              <div className={`${card.bgColor} rounded-lg p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-2 mb-6 shadow-sm">
        <div className="flex gap-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === index
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === index ? { backgroundColor: primaryColor } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Classes Tab Content */}
        {activeTab === 0 && (
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            {/* Header with Search */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Active Classes</h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent w-64"
                  style={{ '--tw-ring-color': primaryColor }}
                />
              </div>
            </div>

            {/* Classes List */}
            <div className="space-y-4">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls, index) => (
                  <div 
                    key={cls.id || index} 
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left Section */}
                      <div className="flex items-center gap-4">
                        <div 
                          className="px-3 py-1 rounded-lg text-white text-sm font-medium"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {cls.courseCode}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{cls.courseTitle}</h3>
                          <p className="text-sm text-gray-500">{cls.studentsCount} students</p>
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiClock className="h-4 w-4" />
                          <span className="text-sm">{cls.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMapPin className="h-4 w-4" />
                          <span className="text-sm">{cls.room}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiUser className="h-4 w-4" />
                          <span className="text-sm">{cls.instructor}</span>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3">
                        <button 
                          className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:brightness-90 transition-colors"
                          style={{ backgroundColor: primaryColor }}
                        >
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FiBookOpen className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No classes found</p>
                    <p className="text-sm">Add your first class to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assignments Tab Content */}
        {activeTab === 1 && (
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Assignments</h2>
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <FiFileText className="h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium">No assignments found</p>
                <p className="text-sm">Create your first assignment to get started</p>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Plans Tab Content */}
        {activeTab === 2 && (
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Lesson Plans</h2>
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <FiCalendar className="h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium">No lesson plans found</p>
                <p className="text-sm">Create your first lesson plan to get started</p>
              </div>
            </div>
          </div>
        )}

        {/* Course Materials Tab Content */}
        {activeTab === 3 && (
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Course Materials</h2>
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <FiBookOpen className="h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium">No course materials found</p>
                <p className="text-sm">Upload your first course material to get started</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instruction;
