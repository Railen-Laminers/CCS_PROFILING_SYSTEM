import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { userAPI } from '../../../services/api';
import { exportToExcel } from '../../../lib/excelHelper';
import { FiPlus, FiDownload, FiUpload, FiX, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // ADDED: New icons for modal
import StudentFormModal from '../../../components/forms/StudentFormModal';
import { useStudents } from '../../../hooks/useStudents';
import StudentFilters from '../../../components/filters/StudentFilters';
import StudentTable from '../../../components/tables/StudentTable';
import Pagination from '../../../components/ui/Pagination';

// Helper to format any date string into YYYY-MM-DD for date input
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

// ADDED: Import Modal Component with template download
const ImportModal = ({ isOpen, onClose, onImport, isImporting }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');

    // ADDED: Handle file selection
    const handleFileSelect = (file) => {
        setError('');

        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx') {
            setError('Please upload only .xlsx files.');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    // ADDED: Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    };

    // ADDED: Handle drag events
    const handleDrag = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === 'dragenter' || event.type === 'dragover') {
            setDragActive(true);
        } else if (event.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // ADDED: Handle drop event
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        const file = event.dataTransfer.files[0];
        handleFileSelect(file);
    };

    // ADDED: Handle import submission
    const handleSubmit = () => {
        if (!selectedFile) {
            setError('Please select a file to import.');
            return;
        }
        onImport(selectedFile);
    };

    // ADDED: Handle template download
    const handleDownloadTemplate = () => {
        try {
            // Create a link to the template file in the assets folder
            const templatePath = '/src/assets/template.xlsx';

            // Fetch the file from the assets folder
            fetch(templatePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Template file not found');
                    }
                    return response.blob();
                })
                .then(blob => {
                    // Create a download link
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'student_import_template.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error downloading template:', error);
                    setError('Failed to download template. Please check if template file exists.');
                });
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to download template.');
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setError('');
        setDragActive(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Modal header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <FiUpload className="w-5 h-5 text-brand-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Import Students</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isImporting}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal body */}
                <div className="p-6">
                    {/* ADDED: Template download button section */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-[#252525] rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Need a template?</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Download our Excel template with the correct format
                                </p>
                            </div>
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-2 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-lg transition-all active:scale-95"
                            >
                                <FiDownload className="w-3.5 h-3.5" />
                                Download Template
                            </button>
                        </div>
                    </div>

                    {/* Drag and drop area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                            relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                            ${dragActive
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                                : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#252525]'
                            }
                            ${selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : ''}
                        `}
                    >
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            disabled={isImporting}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="import-dropzone"
                        />

                        <div className="flex flex-col items-center gap-3">
                            {selectedFile ? (
                                <>
                                    <FiFile className="w-12 h-12 text-green-500" />
                                    <div className="text-center">
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedFile(null);
                                            setError('');
                                        }}
                                        className="text-sm text-red-500 hover:text-red-600"
                                    >
                                        Remove file
                                    </button>
                                </>
                            ) : (
                                <>
                                    <FiUpload className="w-12 h-12 text-gray-400" />
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Drag and drop your Excel file here
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            or <span className="text-brand-500">browse</span> to upload
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        Only .xlsx files are supported (Max 10MB)
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-center gap-2">
                            <FiAlertCircle className="w-4 h-4 text-red-500" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Info message */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            <strong>Excel format required:</strong> First Name, Last Name, Email, Student ID (optional),
                            Password (optional), and other student fields. Download the template for the correct format.
                        </p>
                    </div>
                </div>

                {/* Modal footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleClose}
                        disabled={isImporting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-[#252525] rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isImporting || !selectedFile}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                    >
                        {isImporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <FiCheckCircle className="w-4 h-4" />
                                Import Students
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudentPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Custom logic hook
    const {
        students,
        loading,
        pagination,
        currentPage,
        setCurrentPage,
        tempSearchQuery,
        setTempSearchQuery,
        tempFilters,
        setTempFilters,
        filters,
        sports,
        organizations,
        isSearching,
        handleSearch,
        clearFilters,
        refresh,
        searchQuery,
        fetchAllStudents
    } = useStudents();

    // Modal and Action state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [modalData, setModalData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // ADDED: State for import modal

    if (user?.role !== 'admin') {
        return <div className="p-6 text-red-500 dark:text-red-400">You do not have permission to view this page.</div>;
    }

    // MODIFIED: Handle import - now accepts file parameter
    const handleImport = async (file) => {
        setIsImporting(true);

        try {
            // Create FormData to send file
            const formData = new FormData();
            formData.append('file', file);

            // Call import API endpoint
            const response = await userAPI.importStudents(formData);

            // Show success message with count
            if (response.data.errors && response.data.errors.length > 0) {
                // Show warning with details if there were partial failures
                showToast(
                    `${response.data.message}\nFailed: ${response.data.errors.length} student(s)`,
                    'warning'
                );
            } else {
                showToast(response.data.message || `Successfully imported ${response.data.importedCount || 0} students.`, 'success');
            }

            // Close modal and refresh
            setIsImportModalOpen(false);
            refresh();

        } catch (err) {
            // Handle error response
            const errorMessage = err.response?.data?.message || 'Failed to import students. Please check your file format.';
            showToast(errorMessage, 'error');
            console.error('Import error:', err);
        } finally {
            setIsImporting(false);
        }
    };

    const handleAdd = () => {
        setModalMode('create');
        setModalData(null);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (student) => {
        const s = student.student;
        setModalData({
            firstname: student.user.firstname,
            middlename: student.user.middlename || '',
            lastname: student.user.lastname,
            user_id: student.user.user_id,
            email: student.user.email,
            password: '',
            password_confirmation: '',
            birth_date: formatDateForInput(student.user.birth_date),
            contact_number: student.user.contact_number || '',
            gender: student.user.gender || '',
            address: student.user.address || '',
            is_active: student.user.is_active,
            parent_guardian_name: s?.parent_guardian_name || '',
            emergency_contact: s?.emergency_contact || '',
            section: s?.section || '',
            program: s?.program || '',
            year_level: s?.year_level || '',
            gpa: s?.gpa || '',
            blood_type: s?.blood_type || '',
            disabilities: s?.disabilities || '',
            medical_condition: s?.medical_condition || '',
            allergies: s?.allergies || '',
            sports_activities: s?.sports_activities || [],
            organizations: s?.organizations || [],
            behavior_discipline_records: s?.behavior_discipline_records || [],
            current_subjects: s?.current_subjects || [],
            academic_awards: s?.academic_awards || [],
        });
        setEditingId(student.user.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => {
        const selectedStudent = students.find(s => s.user.id === userId);
        const studentName = `${selectedStudent?.user.firstname} ${selectedStudent?.user.lastname}`;
        if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) return;

        setDeletingUserId(userId);
        try {
            await userAPI.deleteUser(userId);
            refresh();
            showToast(`${studentName} deleted successfully.`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete student.', 'error');
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleToggleStatus = async (student) => {
        const newStatus = !student.user.is_active;
        const action = newStatus ? 'activate' : 'deactivate';
        if (!window.confirm(`Are you sure you want to ${action} ${student.user.firstname} ${student.user.lastname}?`)) return;

        setTogglingUserId(student.user.id);
        try {
            await userAPI.updateUser(student.user.id, { is_active: newStatus });
            refresh();
            showToast(`${student.user.firstname}'s status updated to ${newStatus ? 'Active' : 'Inactive'}.`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || `Failed to ${action} student.`, 'error');
        } finally {
            setTogglingUserId(null);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const allStudents = await fetchAllStudents();
            if (!allStudents.length) {
                showToast('No students found to export.', 'info');
                return;
            }

            const exportData = allStudents.map(s => ({
                'Student ID': s.user.user_id,
                'Full Name': `${s.user.firstname} ${s.user.middlename ? s.user.middlename + ' ' : ''}${s.user.lastname}`,
                'Email': s.user.email,
                'Gender': s.user.gender || 'N/A',
                'Birth Date': s.user.birth_date ? s.user.birth_date.split('T')[0] : 'N/A',
                'Contact Number': s.user.contact_number ? `'${s.user.contact_number}` : 'N/A',
                'Address': s.user.address || 'N/A',
                'Program': s.student?.program || 'N/A',
                'Year Level': s.student?.year_level || 'N/A',
                'Section': s.student?.section || 'N/A',
                'GPA': s.student?.gpa || 'N/A',
                'Blood Type': s.student?.blood_type || 'N/A',
                'Status': s.user.is_active ? 'Active' : 'Inactive'
            }));

            const date = new Date().toISOString().split('T')[0];
            exportToExcel(exportData, `Student_Management_Report_${date}.xlsx`);
            showToast(`Successfully exported ${allStudents.length} students.`, 'success');
        } catch (err) {
            showToast('Failed to export student data.', 'error');
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full">
            {/* ADDED: Import Modal */}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
                isImporting={isImporting}
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Student Management</h1>
                <div className="flex items-center gap-3">
                    {/* MODIFIED: Import button now opens modal instead of direct file input */}
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 scroll-smooth"
                    >
                        <FiUpload className="w-4 h-4" />
                        Import Data
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#252525] shadow-sm transition-all active:scale-95 scroll-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiDownload className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                        {isExporting ? 'Exporting...' : 'Export Data'}
                    </button>

                    <button
                        onClick={handleAdd}
                        className="relative group overflow-hidden rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <FiPlus className="w-4 h-4" /> Add Student
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover:scale-100 group-active:duration-75"></div>
                    </button>
                </div>
            </div>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={modalData}
                userId={editingId}
                onSuccess={() => {
                    refresh();
                    showToast(`Student ${modalMode === 'create' ? 'created' : 'updated'} successfully.`, 'success');
                }}
            />

            <StudentFilters
                tempSearchQuery={tempSearchQuery}
                setTempSearchQuery={setTempSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                tempFilters={tempFilters}
                setTempFilters={setTempFilters}
                sports={sports}
                organizations={organizations}
                clearFilters={clearFilters}
                searchQuery={searchQuery}
            />

            <StudentTable
                students={students}
                loading={loading}
                navigate={navigate}
                handleToggleStatus={handleToggleStatus}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                togglingUserId={togglingUserId}
                deletingUserId={deletingUserId}
            />

            {!loading && students.length > 0 && (
                <Pagination
                    pagination={pagination}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default StudentPage;