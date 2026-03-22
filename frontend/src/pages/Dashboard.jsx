import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt} from 'react-icons/fa';

export const Dashboard = () => {
  const { user } = useAuth();
  const [studentCount, setStudentCount] = useState(null);
  const [facultyCount, setFacultyCount] = useState(null);
  const [courseCount, setCourseCount] = useState(null);
  const [eventCount, setEventCount] = useState(null); 
  const [countsLoading, setCountsLoading] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      if (user?.role !== 'admin') return;

      setCountsLoading(true);
      try {
        // Fetch full lists and extract lengths
        const students = await userAPI.getStudents();
        const faculty = await userAPI.getFaculty();
        const courses = await userAPI.getCourses();
        const events = await userAPI.getEvents(); 
        setStudentCount(students.length);
        setFacultyCount(faculty.length);
        setCourseCount(courses.length);
        setEventCount(events.length); 
        
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      } finally {
        setCountsLoading(false);
      }
    };

    fetchCounts();
  }, [user]);

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  const roleStyles =
    user.role === 'admin'
      ? 'bg-red-500 text-white'
      : user.role === 'faculty'
        ? 'bg-blue-500 text-white'
        : 'bg-green-500 text-white';

  const fullName = [user.firstname, user.middlename, user.lastname]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Admin-Only: Count Cards with Links */}
      {user.role === 'admin' && (
        <div className=" p-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {/* Student Card Link */}
            <Link
              to="/students"
              className="group block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Total Students
                  </p>
                  {countsLoading ? (
                    <div className="h-10 w-16 bg-blue-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-4xl font-bold text-blue-900 mt-2">
                      {studentCount !== null ? studentCount.toLocaleString() : '—'}
                    </p>
                  )}
                </div>
                <FaUsers className="text-blue-500 text-5xl group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Faculty Card Link */}
            <Link
              to="/faculty"
              className="group block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                    Total Faculty
                  </p>
                  {countsLoading ? (
                    <div className="h-10 w-16 bg-green-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-4xl font-bold text-green-900 mt-2">
                      {facultyCount !== null ? facultyCount.toLocaleString() : '—'}
                    </p>
                  )}
                </div>
                <FaChalkboardTeacher className="text-green-500 text-5xl group-hover:scale-110 transition-transform" />
              </div>
            </Link>
            
            {/* ADDED: New Courses Card Link */}
            <Link
              to="/courses"
              className="group block p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                    Total Courses
                  </p>
                  {countsLoading ? (
                    <div className="h-10 w-16 bg-purple-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-4xl font-bold text-purple-900 mt-2">
                      {courseCount !== null ? courseCount.toLocaleString() : '—'}
                    </p>
                  )}
                </div>
                <FaBook className="text-purple-500 text-5xl group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* ADDED: Events Card Link */}
            <Link
              to="/events"
              className="group block p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                    Total Events
                  </p>
                  {countsLoading ? (
                    <div className="h-10 w-16 bg-orange-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-4xl font-bold text-orange-900 mt-2">
                      {eventCount !== null ? eventCount.toLocaleString() : '—'}
                    </p>
                  )}
                </div>
                <FaCalendarAlt className="text-orange-500 text-5xl group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;