import React, { useEffect, useState } from 'react';
import { FiX, FiSave, FiHome, FiType, FiUsers } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

const RoomFormModal = ({ isOpen, onClose, onSuccess, initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Lecture',
    capacity: 40
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Lecture',
        capacity: initialData.capacity || 40
      });
    } else {
      setFormData({ name: '', type: 'Lecture', capacity: 40 });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await onSubmit(formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors || { global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all";
  const labelClass = "text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <FiHome className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 tracking-tight">
                {initialData ? 'Edit Room' : 'Establish Room'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Facility Management</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className={labelClass}>Room Name</label>
            <div className="relative group">
              <FiType className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              <input name="name" placeholder="e.g. Room 302" className={inputClass} value={formData.name} onChange={handleChange} required />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest mt-1 ml-1">{errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Room Type</label>
            <div className="relative group">
              <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              <select name="type" className={`${inputClass} appearance-none`} value={formData.type} onChange={handleChange}>
                <option value="Lecture">Lecture Room</option>
                <option value="Laboratory">Laboratory</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Capacity</label>
            <div className="relative group">
              <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              <input type="number" name="capacity" min="1" max="200" className={inputClass} value={formData.capacity} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-[2] h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave className="w-4 h-4" /> Save Room</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RoomFormModal;
