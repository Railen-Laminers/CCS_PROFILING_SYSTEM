import { FiEdit2, FiFilter, FiHome, FiPlus, FiRefreshCw, FiSearch, FiServer, FiTrash2, FiUsers } from 'react-icons/fi';
import RoomFormModal from '@/components/forms/RoomFormModal';
import SchedulingFilters from '@/components/filters/SchedulingFilters';
import EmptyState from '@/components/ui/EmptyState';
import { useScheduling } from '@/hooks/useScheduling';

const Scheduling = () => {
    const {
        rooms,
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
        handleCreateRoom,
        handleUpdateRoom,
        handleDeleteRoom,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleCloseModal,
        handleSearch,
        handleReset,
    } = useScheduling();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Facility Scheduling</h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Establish Room
          </span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
        </button>
      </div>

      {/* Search and Filters Extracted (Identical Design) */}
      <SchedulingFilters 
        tempSearchQuery={tempSearchQuery}
        setTempSearchQuery={setTempSearchQuery}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        handleSearch={handleSearch}
        handleReset={handleReset}
        searchQuery={searchQuery}
        filters={filters}
        isSearching={isSearching}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <>
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map(room => (
                <div 
                  key={room._id}
                  onClick={() => navigate(`/scheduling/room/${room._id}`)}
                  className="group bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-brand-500/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                  
                  <div className="flex justify-between items-start mb-4 align-top">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      {room.type === 'Laboratory' ? <FiServer className="w-5 h-5" /> : <FiHome className="w-5 h-5" />}
                    </div>
                    <div className="bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {room.type}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{room.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400 font-medium">
                      <FiUsers className="w-3.5 h-3.5" /> Capacity: {room.capacity} seats
                    </div>

                    {/* Hover-reveal actions */}
                    <div className="flex items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(room);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                        title="Edit Room"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoom(room._id);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        title="Delete Room"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={FiHome}
              title="No Rooms Established"
              description="You haven't established any rooms yet. Rooms are required to configure class schedules and laboratory sessions."
              className="min-h-[450px]"
            />
          )}
        </>
      )}


      <RoomFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialData={editingRoom}
        onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom} 
      />
    </div>
  );
};
export default Scheduling;
