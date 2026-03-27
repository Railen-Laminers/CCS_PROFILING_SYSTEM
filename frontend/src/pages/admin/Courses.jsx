import React from 'react';
import useCourses from '../../hooks/useCourses';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const CoursesPage = () => {
    const {
        courses,
        loading,
        error,
        modalOpen,
        editingCourse,
        formData,
        formErrors,
        submitLoading,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        handleInputChange,
    } = useCourses();

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
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Courses</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <FaPlus size={14} />
                    <span>Add Course</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                    No courses found. Click "Add Course" to create one.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.course_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{course.course_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{course.course_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.course_title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.credits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(course)}
                                            className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-3"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.course_id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                            {editingCourse ? 'Edit Course' : 'Add New Course'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="course_code">
                                    Course Code
                                </label>
                                <input
                                    type="text"
                                    id="course_code"
                                    name="course_code"
                                    value={formData.course_code}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.course_code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {formErrors.course_code && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.course_code}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="course_title">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    id="course_title"
                                    name="course_title"
                                    value={formData.course_title}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.course_title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {formErrors.course_title && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.course_title}</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="credits">
                                    Credits
                                </label>
                                <input
                                    type="number"
                                    id="credits"
                                    name="credits"
                                    value={formData.credits}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="6"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 ${formErrors.credits ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {formErrors.credits && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.credits}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded focus:outline-none"
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;