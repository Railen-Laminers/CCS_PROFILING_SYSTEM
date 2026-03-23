import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null); // null for create, object for edit
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await userAPI.getEvents();
            setEvents(data);
        } catch (err) {
            setError('Failed to load events. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            start_datetime: '',
            end_datetime: '',
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        // Convert datetime strings to local datetime-local format (YYYY-MM-DDThh:mm)
        const startLocal = event.start_datetime.slice(0, 16);
        const endLocal = event.end_datetime.slice(0, 16);
        setFormData({
            title: event.title,
            description: event.description,
            start_datetime: startLocal,
            end_datetime: endLocal,
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            start_datetime: '',
            end_datetime: '',
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            errors.title = 'Title must be at most 200 characters';
        }
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        if (!formData.start_datetime) {
            errors.start_datetime = 'Start date & time is required';
        }
        if (!formData.end_datetime) {
            errors.end_datetime = 'End date & time is required';
        } else if (formData.start_datetime && formData.end_datetime <= formData.start_datetime) {
            errors.end_datetime = 'End date & time must be after start date & time';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitLoading(true);
        try {
            if (editingEvent) {
                await userAPI.updateEvent(editingEvent.event_id, formData);
            } else {
                await userAPI.createEvent(formData);
            }
            await fetchEvents();
            closeModal();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                // Handle validation errors from backend
                const backendErrors = err.response.data.errors;
                const mapped = {};
                if (backendErrors.title) mapped.title = backendErrors.title[0];
                if (backendErrors.description) mapped.description = backendErrors.description[0];
                if (backendErrors.start_datetime) mapped.start_datetime = backendErrors.start_datetime[0];
                if (backendErrors.end_datetime) mapped.end_datetime = backendErrors.end_datetime[0];
                setFormErrors(mapped);
            } else {
                setError('Failed to save event. Please try again.');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await userAPI.deleteEvent(eventId);
            await fetchEvents();
        } catch (err) {
            setError('Failed to delete event. Please try again.');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field-specific error when user types
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Helper to format datetime for display
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Events</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <FaPlus size={14} />
                    <span>Add Event</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                    No events found. Click "Add Event" to create one.
                                </td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.event_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{event.event_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{event.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{event.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDateTime(event.start_datetime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDateTime(event.end_datetime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(event)}
                                            className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-3"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.event_id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                            {editingEvent ? 'Edit Event' : 'Add New Event'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {formErrors.title && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                ></textarea>
                                {formErrors.description && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="start_datetime">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="start_datetime"
                                    name="start_datetime"
                                    value={formData.start_datetime}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.start_datetime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {formErrors.start_datetime && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.start_datetime}</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="end_datetime">
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="end_datetime"
                                    name="end_datetime"
                                    value={formData.end_datetime}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.end_datetime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {formErrors.end_datetime && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.end_datetime}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded focus:outline-none"
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;