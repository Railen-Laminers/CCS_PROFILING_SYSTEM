import React, { forwardRef } from 'react';
import { formatDate } from '@/lib/utils';
import PNCLogo from '../../assets/PNC_logo.png';
import CCSLogo from '../../assets/CCS_logo.png';

const FacultyReport = forwardRef(({ faculty }, ref) => {
    if (!faculty) return null;

    const u = faculty.user || faculty;
    const f = faculty.faculty;
    const fullName = [u.firstname, u.middlename, u.lastname].filter(Boolean).join(' ');

    const SectionTitle = ({ children }) => (
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-black pb-1 mb-3 mt-6">
            {children}
        </h3>
    );

    const formatValue = (val) => {
        if (!val) return 'None recorded';
        if (typeof val === 'string') return val;
        if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : 'None recorded';
        return String(val);
    };

    const InfoRow = ({ label, value }) => (
        <div className="flex py-1.5 border-b border-gray-100 last:border-0 text-[13px] gap-2">
            <span className="font-bold text-gray-700 w-[140px] shrink-0 text-left">{label}</span>
            <span className="text-gray-900 flex-1 text-left">{formatValue(value)}</span>
        </div>
    );

    return (
        <div ref={ref} className="p-12 bg-white min-h-screen text-black font-sans print:p-8">
            {/* Report Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8">
                {/* Left Logo (PNC) */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm shrink-0">
                    <img src={PNCLogo} alt="PNC Logo" className="w-full h-full object-cover p-1" />
                </div>
                
                <div className="text-center flex-1 px-8">
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase leading-tight">Pamantasan ng Lungsod ng Cabuyao</h1>
                    <p className="text-sm font-bold text-black border-b border-black inline-block px-1 pb-0.5 mt-1">
                        COLLEGE OF COMPUTER STUDIES
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-widest leading-none">Faculty Information & Management System</p>
                    <div className="mt-4 inline-block px-4 py-1 bg-black text-white rounded-full text-[13px] font-black tracking-widest uppercase">
                        Official Faculty Profile Report
                    </div>
                </div>

                {/* Right Logo (CCS) */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm shrink-0">
                    <img src={CCSLogo} alt="CCS Logo" className="w-full h-full object-cover p-1" />
                </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Profile Photo Placeholder */}
                <div className="col-span-3">
                    <div className="aspect-square bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-lg font-black text-gray-900 leading-tight">{u.user_id}</p>
                        <p className="text-xs font-bold text-black uppercase tracking-wider">{f?.position || 'N/A'}</p>
                    </div>
                </div>

                {/* Info List */}
                <div className="col-span-9">
                    <SectionTitle>Account Information</SectionTitle>
                    <div className="grid grid-cols-1 gap-x-8">
                        <InfoRow label="Full Name" value={fullName} />
                        <InfoRow label="Email Address" value={u.email} />
                        <InfoRow label="Contact Number" value={u.contact_number} />
                        <div className="grid grid-cols-2 gap-x-8">
                            <InfoRow label="Gender" value={u.gender} />
                            <InfoRow label="Birthdate" value={formatDate(u.birth_date)} />
                        </div>
                        <InfoRow label="Official Designation" value={u.address} />
                    </div>
                </div>
            </div>

            {/* Faculty Section */}
            <div className="mt-4">
                <SectionTitle>Faculty Role & Specialization</SectionTitle>
                <div className="grid grid-cols-2 gap-x-12">
                    <div>
                        <InfoRow label="Department" value={f?.department} />
                        <InfoRow label="Position / Rank" value={f?.position} />
                    </div>
                    <div>
                        <InfoRow label="Specialization" value={f?.specialization} />
                    </div>
                </div>

                <div className="mt-6">
                    <SectionTitle>Teaching & Academic Records</SectionTitle>
                    <InfoRow label="Subjects Handled" value={f?.subjects_handled} />
                    <div className="mt-4">
                        <p className="text-xs font-bold text-gray-600 mb-2 uppercase">Teaching Schedule</p>
                        <div className="bg-gray-50 p-4 border border-gray-200 text-xs italic text-gray-700">
                            {formatValue(f?.teaching_schedule)}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <SectionTitle>Research & Projects</SectionTitle>
                    <div className="bg-gray-50 p-4 border border-gray-200 text-xs italic text-gray-700">
                        {formatValue(f?.research_projects)}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="border-b border-black mb-1 w-full h-8"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Faculty Member's Signature</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mt-8">Report Generated On:</p>
                    <p className="text-xs font-black">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black mb-1 w-full h-8"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Registrar / Dean's Signature</p>
                </div>
            </div>

            <div className="mt-8 text-center text-[9px] text-gray-400 italic">
                This is a computer-generated document from the Railen-Laminers Profiling System. No physical signature is required unless specified.
            </div>
        </div>
    );
});

FacultyReport.displayName = 'FacultyReport';

export default FacultyReport;
