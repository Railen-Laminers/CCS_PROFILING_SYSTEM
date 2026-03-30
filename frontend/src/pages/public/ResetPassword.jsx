import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaChartLine } from 'react-icons/fa';
import { authAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import loginBg from '../../assets/Bagong_Cabuyao_Hall.jpg';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [errors, setErrors] = useState({});

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (password !== passwordConfirmation) {
            setErrors({ password: ['Passwords do not match'] });
            return;
        }

        setIsResetting(true);
        try {
            await authAPI.resetPassword({
                token,
                email,
                password,
            });
            showToast('Password reset successfully! You can now login.', 'success');
            navigate('/login');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Failed to reset password', 'error');
            }
        } finally {
            setIsResetting(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
                    <Link to="/login" className="text-brand-500 font-medium hover:underline">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat fixed inset-0 flex items-center justify-center p-4 md:p-8 transition-all duration-700"
            style={{ backgroundImage: `url(${loginBg})` }}
        >
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"></div>

            <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 z-10 border border-white/20">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <FaChartLine className="text-4xl text-brand-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Create New Password</h3>
                    <p className="text-gray-500 mt-2">Enter your new password below to regain access.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-[#F9FAFB] text-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500
                                          ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-500 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-[#F9FAFB] text-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isResetting}
                        className="w-full bg-brand-500 hover:bg-brand-400 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isResetting ? 'Updating Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-gray-500 text-sm hover:text-brand-500 transition-colors">
                        Remembered your password? <span className="text-brand-500 font-medium">Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
