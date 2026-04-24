import { useState, useEffect } from 'react';
import { userAPI, courseAPI, eventAPI, studentProfileAPI } from '../services/api';

const useDashboardStats = (userRole) => {
    const [studentCount, setStudentCount] = useState(null);
    const [facultyCount, setFacultyCount] = useState(null);
    const [courseCount, setCourseCount] = useState(null);
    const [eventCount, setEventCount] = useState(null);
    const [sportsCount, setSportsCount] = useState(null);
    const [orgCount, setOrgCount] = useState(null);
    const [academicData, setAcademicData] = useState([]);
    const [participationData, setParticipationData] = useState([]);
    const [courseDistribution, setCourseDistribution] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchCounts = async () => {
            if (userRole !== 'admin') return;

            setLoading(true);
            try {
                const [students, faculty, courses, events] = await Promise.all([
                    userAPI.getStudents(signal),
                    userAPI.getFaculty(signal),
                    courseAPI.getCourses(signal),
                    eventAPI.getEvents(signal)
                ]);

                setStudentCount(students.length);
                setFacultyCount(faculty.length);
                setCourseCount(courses.length);
                setEventCount(events.length);

                // Derive extra counts from student data
                let sports = 0, orgs = 0;

                // For chart computation
                const gpaByYear = {}; 
                const programCounts = {};
                let contestCount = 0;

                students.forEach(entry => {
                    const profile = entry.student;
                    if (!profile) return;

                    // Sports: sports_activities is Mixed type, check if it has meaningful data
                    const sa = profile.sports_activities;
                    if (sa && (
                        (Array.isArray(sa) && sa.length > 0) ||
                        (typeof sa === 'object' && !Array.isArray(sa) && (sa.sportsPlayed?.length > 0 || sa.athleticAchievements?.length > 0 || sa.schoolTeam?.length > 0))
                    )) sports++;

                    // Organizations: Mixed type
                    const org = profile.organizations;
                    if (org && (
                        (Array.isArray(org) && org.length > 0) ||
                        (typeof org === 'object' && !Array.isArray(org) && (org.clubs?.length > 0 || org.studentCouncil || org.fraternities?.length > 0))
                    )) orgs++;



                    // Academic Performance: GPA by year level
                    if (profile.year_level && profile.gpa != null) {
                        if (!gpaByYear[profile.year_level]) {
                            gpaByYear[profile.year_level] = { total: 0, count: 0 };
                        }
                        gpaByYear[profile.year_level].total += profile.gpa;
                        gpaByYear[profile.year_level].count += 1;
                    }

                    // Course Distribution: count by program
                    if (profile.program) {
                        programCounts[profile.program] = (programCounts[profile.program] || 0) + 1;
                    }

                    // Contests: quiz_bee + programming_contests
                    if ((profile.quiz_bee_participations && profile.quiz_bee_participations.length > 0) ||
                        (profile.programming_contests && profile.programming_contests.length > 0)) {
                        contestCount++;
                    }
                });

                setSportsCount(sports);
                setOrgCount(orgs);

                // Build academic performance chart data
                const yearLabels = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };
                const academicChartData = [1, 2, 3, 4].map(yr => ({
                    name: yearLabels[yr],
                    gpa: gpaByYear[yr] ? parseFloat((gpaByYear[yr].total / gpaByYear[yr].count).toFixed(2)) : 0
                }));
                setAcademicData(academicChartData);

                // Build participation chart data
                setParticipationData([
                    { name: 'Sports', value: sports },
                    { name: 'Organizations', value: orgs },
                    { name: 'Contests', value: contestCount },
                ].filter(d => d.value > 0));

                // Build course distribution chart data
                const programLabels = { 'BSIT': 'BS IT', 'BSCS': 'BS CS', 'BSIS': 'BS IS' };
                const courseChartData = Object.entries(programCounts).map(([key, val]) => ({
                    name: programLabels[key] || key,
                    students: val
                }));
                setCourseDistribution(courseChartData);

            } catch (error) {
                if (error.name === 'CanceledError' || error.name === 'AbortError') {
                    // Ignore cancellation errors
                    return;
                }
                console.error('Failed to fetch counts:', error);
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCounts();

        return () => {
            controller.abort();
        };
    }, [userRole]);

    return {
        studentCount,
        facultyCount,
        courseCount,
        eventCount,
        sportsCount,
        orgCount,
        academicData,
        participationData,
        courseDistribution,
        loading,
    };
};

export default useDashboardStats;
