import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import useFaculty from '@/hooks/useFaculty';
import { exportToExcel } from '@/lib/excelHelper';
import { FiPlus, FiDownload, FiUsers } from 'react-icons/fi';
import FacultyFilters from '@/components/filters/FacultyFilters';
import Pagination from '@/components/ui/Pagination';
import FacultyFormModal from '@/components/forms/FacultyFormModal';
import FacultyGrid from '@/components/tables/FacultyGrid';

const FacultyPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const {
        faculty,
        loading,
        error,
        pagination,
        currentPage,
        setCurrentPage,
        tempSearchQuery,
        setTempSearchQuery,
        filters,
        setFilters,
        departments,
        positions,
        isSearching,
        handleSearch,
        clearFilters,
        searchQuery,
        fetchAllFaculty,
        formMode,
        formData,
        fieldErrors,
        touched,
        showForm,
        isCreating,
        isUpdating,
        deletingUserId,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        handleInputChange,
        handleBlur,
        resetForm,
        handleCreate,
        handleEdit,
        handleUpdate,
        handleDelete,
        openCreateForm,
        refresh,
    } = useFaculty();

    const [isExporting, setIsExporting] = useState(false);

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const allFaculty = await fetchAllFaculty();
            if (!allFaculty.length) {
                showToast('No faculty records found to export.', 'info');
                return;
            }
            const exportData = allFaculty.map(f => ({
                'Faculty ID': f.user.user_id,
                'Full Name': `${f.user.firstname} ${f.user.middlename ? f.user.middlename + ' ' : ''}${f.user.lastname}`,
                'Email': f.user.email,
                'Department': f.faculty?.department || 'N/A',
                'Position': f.faculty?.position || 'N/A',
                'Specialization': f.faculty?.specialization || 'N/A',
                'Contact Number': f.user.contact_number ? `'${f.user.contact_number}` : 'N/A',
                'Status': f.user.is_active ? 'Active' : 'Inactive'
            }));
            const date = new Date().toISOString().split('T')[0];
            exportToExcel(exportData, `Faculty_Management_Report_${date}.xlsx`);
            showToast(`Successfully exported ${allFaculty.length} faculty records.`, 'success');
        } catch (err) {
            showToast('Failed to export faculty data.', 'error');
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Faculty Management</h1>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        <FiDownload className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} /> 
                        {isExporting ? 'Exporting...' : 'Export Data'}
                    </button>
                    <button
                        onClick={openCreateForm}
                        className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <FiPlus className="w-4 h-4" /> Add Faculty
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100"></div>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <FacultyFilters 
                tempSearchQuery={tempSearchQuery}
                setTempSearchQuery={setTempSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                filters={filters}
                setFilters={setFilters}
                departments={departments}
                positions={positions}
                clearFilters={clearFilters}
                searchQuery={searchQuery}
            />

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                    {error}
                </div>
            )}

            {/* Form Modal */}
            <FacultyFormModal 
                showForm={showForm}
                resetForm={resetForm}
                formMode={formMode}
                formData={formData}
                fieldErrors={fieldErrors}
                touched={touched}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
                isCreating={isCreating}
                isUpdating={isUpdating}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                departments={departments}
                positions={positions}
            />

            {/* Faculty Cards Grid */}
            <FacultyGrid 
                faculty={faculty}
                loading={loading}
                navigate={navigate}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                deletingUserId={deletingUserId}
            />

            {/* Pagination */}
            {!loading && faculty.length > 0 && (
                <div className="mt-8">
                    <Pagination 
                        pagination={pagination}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default FacultyPage;
