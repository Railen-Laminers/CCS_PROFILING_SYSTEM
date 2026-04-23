import { useState, useEffect } from 'react';
import { eventAPI, userAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Temporary filter states (for manual apply)
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    const [tempCategoryFilter, setTempCategoryFilter] = useState('All');
    const [tempStatusFilter, setTempStatusFilter] = useState('All');
    const [isSearching, setIsSearching] = useState(false);

    const [participantModalOpen, setParticipantModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Extra-Curricular',
        venue: '',
        max_participants: '',
        has_max_participants: false,
        status: 'Upcoming',
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

    const handleSearch = () => {
        setIsSearching(true);
        // Simulate a small delay for better UX (consistent with other modules)
        setTimeout(() => {
            setSearchQuery(tempSearchQuery);
            setCategoryFilter(tempCategoryFilter);
            setStatusFilter(tempStatusFilter);
            setIsSearching(false);
        }, 300);
    };

    const clearFilters = () => {
        setTempSearchQuery('');
        setTempCategoryFilter('All');
        setTempStatusFilter('All');
        setSearchQuery('');
        setCategoryFilter('All');
        setStatusFilter('All');
    };

    const fetchStudents = async () => {
        try {
            const data = await userAPI.getStudents();
            setAllStudents(data);
        } catch (err) {
            console.error('Failed to load students:', err);
        }
    };

    const openCreateModal = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            category: 'Extra-Curricular',
            venue: '',
            max_participants: '',
            has_max_participants: false,
            status: 'Upcoming',
            start_datetime: '',
            end_datetime: '',
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        const startLocal = event.start_datetime ? event.start_datetime.slice(0, 16) : '';
        const endLocal = event.end_datetime ? event.end_datetime.slice(0, 16) : '';
        setFormData({
            title: event.title,
            description: event.description || '',
            category: event.category || 'Extra-Curricular',
            venue: event.venue || '',
            max_participants: event.max_participants || '',
            has_max_participants: event.max_participants !== null && event.max_participants !== undefined,
            status: event.status || 'Upcoming',
            start_datetime: startLocal,
            end_datetime: endLocal,
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingEvent(null);
        setFormErrors({});
    };

    const openParticipantModal = (event) => {
        setSelectedEvent(event);
        setParticipantModalOpen(true);
        fetchStudents();
    };

    const closeParticipantModal = () => {
        setParticipantModalOpen(false);
        setSelectedEvent(null);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            errors.title = 'Title must be at most 200 characters';
        }
        if (!formData.start_datetime) {
            errors.start_datetime = 'Start date & time is required';
        }
        if (!formData.end_datetime) {
            errors.end_datetime = 'End date & time is required';
        } else if (formData.start_datetime && formData.end_datetime <= formData.start_datetime) {
            errors.end_datetime = 'End date & time must be after start date & time';
        }
        if (formData.has_max_participants && (!formData.max_participants || formData.max_participants < 1)) {
            errors.max_participants = 'Must be at least 1';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitLoading(true);
        const payload = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            venue: formData.venue || null,
            max_participants: formData.has_max_participants ? parseInt(formData.max_participants) : null,
            status: formData.status,
            start_datetime: formData.start_datetime,
            end_datetime: formData.end_datetime,
        };

        try {
            if (editingEvent) {
                await eventAPI.updateEvent(editingEvent.event_id, payload);
                showToast('Event updated successfully.', 'success');
            } else {
                await eventAPI.createEvent(payload);
                showToast('Event created successfully.', 'success');
            }
            await fetchEvents();
            closeModal();
            setError(null);
        } catch (err) {
            if (err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                const mapped = {};
                Object.keys(backendErrors).forEach(key => {
                    mapped[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key];
                });
                setFormErrors(mapped);
            } else {
                showToast(err.response?.data?.message || 'Failed to save event.', 'error');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await eventAPI.deleteEvent(eventId);
            showToast('Event deleted successfully.', 'success');
            await fetchEvents();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete event.', 'error');
        }
    };

    const handleInvite = async (eventId, userId) => {
        try {
            await eventAPI.inviteStudent(eventId, userId);
            showToast('Invitation sent successfully.', 'success');
            await fetchEvents();
            // Refresh selectedEvent if participant modal is open
            if (selectedEvent && selectedEvent.event_id === eventId) {
                const updated = await eventAPI.getEvents();
                const refreshed = updated.find(e => e.event_id === eventId);
                if (refreshed) setSelectedEvent(refreshed);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send invitation.', 'error');
        }
    };

    const handleRespondInvitation = async (eventId, response) => {
        try {
            await eventAPI.respondToInvitation(eventId, response);
            showToast(`Invitation ${response} successfully.`, 'success');
            await fetchEvents();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to respond to invitation.', 'error');
        }
    };

    const handleRegister = async (eventId, userId) => {
        try {
            await eventAPI.registerForEvent(eventId, userId);
            showToast('Student registered successfully.', 'success');
            await fetchEvents();
            // Refresh selectedEvent if participant modal is open
            if (selectedEvent && selectedEvent.event_id === eventId) {
                const updated = await eventAPI.getEvents();
                const refreshed = updated.find(e => e.event_id === eventId);
                if (refreshed) setSelectedEvent(refreshed);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to register student.', 'error');
        }
    };

    const handleUnregister = async (eventId, userId) => {
        try {
            await eventAPI.unregisterFromEvent(eventId, userId);
            showToast('Student unregistered successfully.', 'success');
            await fetchEvents();
            if (selectedEvent && selectedEvent.event_id === eventId) {
                const updated = await eventAPI.getEvents();
                const refreshed = updated.find(e => e.event_id === eventId);
                if (refreshed) setSelectedEvent(refreshed);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to unregister student.', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Filtered events
    const filteredEvents = events.filter(event => {
        const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
        const matchesSearch = !searchQuery || 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.venue && event.venue.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesStatus && matchesSearch;
    });

    return {
        events: filteredEvents,
        allEvents: events,
        allStudents,
        loading,
        error,
        modalOpen,
        editingEvent,
        formData,
        formErrors,
        submitLoading,
        categoryFilter,
        statusFilter,
        tempCategoryFilter,
        setTempCategoryFilter,
        tempStatusFilter,
        setTempStatusFilter,
        tempSearchQuery,
        setTempSearchQuery,
        isSearching,
        handleSearch,
        clearFilters,
        searchQuery,
        participantModalOpen,
        selectedEvent,
        openCreateModal,
        openEditModal,
        closeModal,
        openParticipantModal,
        closeParticipantModal,
        handleSubmit,
        handleDelete,
        handleRegister,
        handleInvite,
        handleRespondInvitation,
        handleUnregister,
        handleInputChange,
        formatDateTime,
    };

};

export default useEvents;
