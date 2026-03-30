import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';

const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        course_code: '',
        course_title: '',
        credits: 3,
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await courseAPI.getCourses();
            setCourses(data);
        } catch (err) {
            setError('Failed to load courses. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({ course_code: '', course_title: '', credits: 3 });
        setFormErrors({});
        setModalOpen(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            course_code: course.course_code,
            course_title: course.course_title,
            credits: course.credits,
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCourse(null);
        setFormData({ course_code: '', course_title: '', credits: 3 });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.course_code.trim()) {
            errors.course_code = 'Course code is required';
        } else if (formData.course_code.length > 20) {
            errors.course_code = 'Course code must be at most 20 characters';
        }
        if (!formData.course_title.trim()) {
            errors.course_title = 'Course title is required';
        } else if (formData.course_title.length > 100) {
            errors.course_title = 'Course title must be at most 100 characters';
        }
        if (!formData.credits) {
            errors.credits = 'Credits are required';
        } else if (formData.credits < 1 || formData.credits > 6) {
            errors.credits = 'Credits must be between 1 and 6';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitLoading(true);
        try {
            if (editingCourse) {
                await courseAPI.updateCourse(editingCourse.course_id, formData);
            } else {
                await courseAPI.createCourse(formData);
            }
            await fetchCourses();
            closeModal();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const backendErrors = err.response.data.errors;
                const mapped = {};
                if (backendErrors.course_code) mapped.course_code = backendErrors.course_code[0];
                if (backendErrors.course_title) mapped.course_title = backendErrors.course_title[0];
                if (backendErrors.credits) mapped.credits = backendErrors.credits[0];
                setFormErrors(mapped);
            } else {
                setError('Failed to save course. Please try again.');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await courseAPI.deleteCourse(courseId);
            await fetchCourses();
        } catch (err) {
            setError('Failed to delete course. Please try again.');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return {
        courses,
        loading,
        error,
        modalOpen,
        editingCourse,
        formData,
        formErrors,
        submitLoading,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        handleInputChange,
    };
};

export default useCourses;
