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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create room.', 'error');
            throw err;
        }
    };

    const handleSearch = () => {
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
        isModalOpen,
        setIsModalOpen,
        navigate,
        fetchRooms,
        handleCreateRoom,
        handleSearch,
        handleReset,
    };
};
