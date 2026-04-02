import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI, instructionAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { transformClassesToEvents } from '../lib/schedulingHelpers';

export const useSchedulingRoomDetail = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [room, setRoom] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [currentView, setCurrentView] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rooms, allClasses] = await Promise.all([
                roomAPI.getRooms(),
                instructionAPI.getClasses() 
            ]);
            
            const currentRoom = rooms.find(r => r._id === roomId);
            if (!currentRoom) {
                showToast('Room not found.', 'error');
                navigate('/scheduling');
                return;
            }
            setRoom(currentRoom);
            
            const roomClasses = allClasses.filter(c => c.room_id && (c.room_id._id === roomId || c.room_id === roomId));
            
            const parsedEvents = transformClassesToEvents(
                roomClasses,
                (cls) => handleSelectEvent({ resource: cls }),
                (classId) => handleDeleteClass(classId)
            );

            setEvents(parsedEvents);
        } catch (err) {
            console.error(err);
            showToast('Failed to load schedule.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async (classId) => {
        if(window.confirm('Delete this class schedule?')) {
            try {
                await instructionAPI.deleteClass(classId);
                showToast('Class deleted.', 'info');
                fetchData();
            } catch(e) {
                showToast(e.response?.data?.message || 'Failed to delete.', 'error');
            }
        }
    };

    const handleClassSubmit = async (classData, classId) => {
        try {
            if (classId) {
                await instructionAPI.updateClass(classId, classData);
                showToast('Class updated successfully.', 'success');
            } else {
                await instructionAPI.createClass(classData);
                showToast('Class scheduled successfully.', 'success');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            // Error is handled by the modal component for validation
            throw err;
        }
    };
    
    const handleSelectEvent = (event) => {
        setSelectedClass(event.resource);
        setIsModalOpen(true);
    };

    const handleViewChange = (view) => setCurrentView(view);
    const handleNavigate = (date) => setCurrentDate(date);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClass(null);
    };

    useEffect(() => {
        fetchData();
    }, [roomId]);

    return {
        room,
        roomId,
        events,
        loading,
        isModalOpen,
        setIsModalOpen,
        selectedClass,
        setSelectedClass,
        currentView,
        currentDate,
        handleDeleteClass,
        handleClassSubmit,
        handleSelectEvent,
        handleViewChange,
        handleNavigate,
        handleCloseModal,
        navigate,
    };
};
