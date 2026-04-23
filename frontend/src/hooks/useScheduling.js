import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export const useScheduling = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    
    const [filters, setFilters] = useState({
        type: 'All'
    });
    
    const [tempFilters, setTempFilters] = useState({
        type: 'All'
    });

    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await roomAPI.getRooms();
            setRooms(data);
            setFilteredRooms(data);
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
            handleCloseModal();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create room.', 'error');
            throw err;
        }
    };

    const handleUpdateRoom = async (roomData) => {
        try {
            await roomAPI.updateRoom(editingRoom._id, roomData);
            showToast('Room successfully updated.', 'success');
            fetchRooms();
            handleCloseModal();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update room.', 'error');
            throw err;
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room? This will remove all associated schedules.')) {
            return;
        }

        try {
            await roomAPI.deleteRoom(roomId);
            showToast('Room successfully deleted.', 'success');
            fetchRooms();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete room.', 'error');
        }
    };

    const handleOpenCreateModal = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (room) => {
        setEditingRoom(room);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };

    const handleSearch = async () => {
        setIsSearching(true);
        // Simulate search delay for UI feedback consistency
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSearchQuery(tempSearchQuery);
        setFilters(tempFilters);
        
        let results = [...rooms];
        
        if (tempSearchQuery.trim()) {
            results = results.filter(room => 
                room.name.toLowerCase().includes(tempSearchQuery.toLowerCase())
            );
        }

        if (tempFilters.type !== 'All') {
            results = results.filter(room => room.type === tempFilters.type);
        }

        setFilteredRooms(results);
        setIsSearching(false);
    };

    const handleReset = () => {
        setSearchQuery('');
        setTempSearchQuery('');
        setFilters({ type: 'All' });
        setTempFilters({ type: 'All' });
        setFilteredRooms(rooms);
    };

    return {
        rooms: filteredRooms,
        searchQuery,
        tempSearchQuery,
        setTempSearchQuery,
        filters,
        tempFilters,
        setTempFilters,
        loading,
        isSearching,
        isModalOpen,
        editingRoom,
        setIsModalOpen,
        navigate,
        fetchRooms,
        handleCreateRoom,
        handleUpdateRoom,
        handleDeleteRoom,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleCloseModal,
        handleSearch,
        handleReset,
    };
};
