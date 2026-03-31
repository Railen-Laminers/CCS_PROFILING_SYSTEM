import React from 'react';
import useEvents from '../../../hooks/useEvents';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';

const EventsPage = () => {
    const {
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
    } = useEvents();

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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Events</h1>
                <button
                    onClick={openCreateModal}
                    className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 transition-colors font-medium"
                >
                    <FaPlus size={16} />
                    <span>Add Event</span>
                </button>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative">
                <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[768px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[25%]">Title</th>
                                <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[20%] hidden sm:table-cell">Description</th>
                                <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[18%]">Start Date</th>
                                <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 w-[18%] hidden md:table-cell">End Date</th>
                                <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-left w-[19%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm text-gray-500 dark:text-zinc-400">
                                        No events found. Click "Add Event" to create one.
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr 
                                        key={event.event_id} 
                                        className="hover:bg-brand-500/10 transition-all duration-200 h-[64px] group hover:shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]"
                                    >
                                        <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-900 dark:text-gray-100 font-medium">
                                            <div className="truncate max-w-xs" title={event.title}>{event.title}</div>
                                        </td>
                                        <td className="py-2 pr-4 text-[14px] text-gray-700 dark:text-zinc-400 hidden sm:table-cell">
                                            <div className="truncate max-w-xs" title={event.description}>{event.description || 'N/A'}</div>
                                        </td>
                                        <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400">
                                            <div className="truncate max-w-xs text-xs sm:text-sm" title={formatDateTime(event.start_datetime)}>
                                                {formatDateTime(event.start_datetime)}
                                            </div>
                                        </td>
                                        <td className="py-2 pr-4 whitespace-nowrap text-[14px] text-gray-700 dark:text-zinc-400 hidden md:table-cell">
                                            <div className="truncate max-w-xs text-xs sm:text-sm" title={formatDateTime(event.end_datetime)}>
                                                {formatDateTime(event.end_datetime)}
                                            </div>
                                        </td>
                                        <td className="py-2 px-1 whitespace-nowrap text-left">
                                            <div className="flex justify-start gap-2 items-center">
                                                <button
                                                    onClick={() => openEditModal(event)}
                                                    className="text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-500/10 transition-colors p-1.5 rounded-md"
                                                    title="Edit Event"
                                                >
                                                    <FaEdit className="w-[16px] h-[16px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.event_id)}
                                                    className="text-red-500 hover:bg-red-200 dark:hover:bg-red-500/10 transition-colors p-1.5 rounded-md"
                                                    title="Delete Event"
                                                >
                                                    <FaTrash className="w-[16px] h-[16px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative border border-gray-200 dark:border-gray-800">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 dark:text-white text-gray-900">
                            {editingEvent ? 'Edit Event' : 'Add New Event'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 text-gray-900 dark:text-white ${
                                        formErrors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                {formErrors.title && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                                        formErrors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                ></textarea>
                                {formErrors.description && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="start_datetime">
                                        Start Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="start_datetime"
                                        name="start_datetime"
                                        value={formData.start_datetime}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 text-gray-900 dark:text-white ${
                                            formErrors.start_datetime ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    />
                                    {formErrors.start_datetime && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.start_datetime}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="end_datetime">
                                        End Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="end_datetime"
                                        name="end_datetime"
                                        value={formData.end_datetime}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 text-gray-900 dark:text-white ${
                                            formErrors.end_datetime ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    />
                                    {formErrors.end_datetime && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.end_datetime}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition-colors"
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-colors"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <>
                                            <span className="animate-spin">⟳</span>
                                            <span>Saving...</span>
                                        </>
                                    ) : editingEvent ? (
                                        <>
                                            <FaEdit size={14} />
                                            <span>Update</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus size={14} />
                                            <span>Create</span>
                                        </>
                                    )}
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
