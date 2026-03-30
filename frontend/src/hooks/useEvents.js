import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';

const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
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
            const data = await eventAPI.getEvents();
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
                await eventAPI.updateEvent(editingEvent.event_id, formData);
            } else {
                await eventAPI.createEvent(formData);
            }
            await fetchEvents();
            closeModal();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
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
            await eventAPI.deleteEvent(eventId);
            await fetchEvents();
        } catch (err) {
            setError('Failed to delete event. Please try again.');
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

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    return {
        events,
        loading,
        error,
        modalOpen,
        editingEvent,
        formData,
        formErrors,
        submitLoading,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        handleInputChange,
        formatDateTime,
    };
};

export default useEvents;
