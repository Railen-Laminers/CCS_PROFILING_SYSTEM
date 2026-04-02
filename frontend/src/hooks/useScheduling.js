import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export const useScheduling = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await roomAPI.getRooms();
            setRooms(data);
        } catch (err) {
            showToast('Failed to load rooms.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleCreateRoom = async (roomData) => {
        try {
            await roomAPI.createRoom(roomData);
            showToast('Room successfully created.', 'success');
            fetchRooms();
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create room.', 'error');
            throw err; // Allow modal to handle error if needed
        }
    };

    return {
        rooms,
        loading,
        isModalOpen,
        setIsModalOpen,
        navigate,
        fetchRooms,
        handleCreateRoom,
    };
};
