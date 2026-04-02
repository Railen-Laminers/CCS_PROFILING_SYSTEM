import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiPlus, FiServer, FiUsers } from 'react-icons/fi';
import { roomAPI } from '@/services/api';
import RoomFormModal from '@/components/forms/RoomFormModal';
import { useToast } from '@/contexts/ToastContext';

const Scheduling = () => {
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
      showToast('Failed to load rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (roomData) => {
    await roomAPI.createRoom(roomData);
    showToast('Room successfully created', 'success');
    fetchRooms();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Facility Scheduling</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Select a room to configure its class schedule.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Establish Room
          </span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map(room => (
            <div 
              key={room._id}
              onClick={() => navigate(`/scheduling/room/${room._id}`)}
              className="group bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-brand-500/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              
              <div className="flex justify-between items-start mb-6 align-top">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  {room.type === 'Laboratory' ? <FiServer className="w-6 h-6" /> : <FiHome className="w-6 h-6" />}
                </div>
                <div className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {room.type}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{room.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 font-medium">
                <FiUsers className="w-4 h-4" /> Capacity: {room.capacity} seats
              </div>
            </div>
          ))}

          {rooms.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-[#18181B] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <FiHome className="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-4" />
              <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">No rooms established yet</p>
            </div>
          )}
        </div>
      )}

      <RoomFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateRoom} 
      />
    </div>
  );
};
export default Scheduling;
