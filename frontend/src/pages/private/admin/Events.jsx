import React from 'react';
import useEvents from '../../../hooks/useEvents';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

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
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl relative mb-4">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Events Management</h1>
                <Button
                    onClick={openCreateModal}
                    className="flex items-center gap-2"
                >
                    <FaPlus size={14} />
                    <span>Add Event</span>
                </Button>
            </div>

            <Card className="bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-md border-white/20 dark:border-gray-800/50">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">Description</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Start Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hidden md:table-cell">End Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
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
                                            className="hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-all duration-200 group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                <div className="truncate max-w-xs" title={event.title}>{event.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-zinc-400 hidden sm:table-cell">
                                                <div className="truncate max-w-xs" title={event.description}>{event.description || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-zinc-400">
                                                {formatDateTime(event.start_datetime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-zinc-400 hidden md:table-cell">
                                                {formatDateTime(event.end_datetime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(event)}
                                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                                        title="Edit Event"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(event.event_id)}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                        title="Delete Event"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal for Create/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
                                {editingEvent ? 'Edit Event' : 'Add New Event'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white ${
                                            formErrors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                        }`}
                                        placeholder="Enter event title"
                                    />
                                    {formErrors.title && (
                                        <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.title}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white resize-none ${
                                            formErrors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                        }`}
                                        placeholder="Describe the event"
                                    ></textarea>
                                    {formErrors.description && (
                                        <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.description}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="start_datetime">
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="start_datetime"
                                            name="start_datetime"
                                            value={formData.start_datetime}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white ${
                                                formErrors.start_datetime ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                            }`}
                                        />
                                        {formErrors.start_datetime && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.start_datetime}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="end_datetime">
                                            End Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="end_datetime"
                                            name="end_datetime"
                                            value={formData.end_datetime}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white ${
                                                formErrors.end_datetime ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                            }`}
                                        />
                                        {formErrors.end_datetime && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.end_datetime}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={closeModal}
                                        disabled={submitLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="gap-2"
                                    >
                                        {submitLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : editingEvent ? (
                                            <>
                                                <FaEdit size={14} />
                                                <span>Update Event</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus size={14} />
                                                <span>Create Event</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
