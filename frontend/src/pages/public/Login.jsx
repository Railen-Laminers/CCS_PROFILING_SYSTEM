import React from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaChartLine, FaEnvelope } from 'react-icons/fa';
import loginBg from '../../assets/Bagong_Cabuyao_Hall.jpg';
import { useLogin } from '../../hooks/useLogin';
import { useTheme } from '../../contexts/ThemeContext';

const LoginPage = () => {
    const { systemTitle, logoUrl } = useTheme();
    const {
        identifier,
        password,
        showPassword,
        showForgotModal,
        forgotEmail,
        isSendingReset,
        showContactModal,
        contactForm,
        isSendingContact,
        identifierError,
        passwordError,
        serverError,
        authLoading,
        isProcessing,
        handleIdentifierChange,
        handlePasswordChange,
        togglePasswordVisibility,
        handleSubmit,
        handleForgotPassword,
        handleContactSubmit,
        setShowForgotModal,
        setForgotEmail,
        setShowContactModal,
        setContactForm,
    } = useLogin();

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat fixed inset-0 flex items-center justify-center p-4 md:p-8 transition-all duration-700"
            style={{ backgroundImage: `url(${loginBg})` }}
        >
            {/* Universal Overlay for image depth and theme readability - slightly reduced opacity */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"></div>

            <div className="max-w-6xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 z-10 transition-all duration-500">

                {/* LEFT SIDE - Branding with solid color */}
                <div 
                    className="md:w-1/2 p-8 md:p-12 flex flex-col text-white relative overflow-hidden bg-brand-600"
                >
                    {/* Modern Mesh & Pattern Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 z-0"></div>
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-[100px]"></div>
                        <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-black/10 blur-[80px]"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-20"></div>
                    </div>
                    
                    {/* Brand Header */}
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="System logo"
                                    className="h-10 w-10 md:h-12 md:w-12 object-contain"
                                />
                            ) : (
                                <FaChartLine className="text-3xl md:text-4xl text-brand-600" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-wider text-white leading-none uppercase">CCS</span>
                            <span className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase mt-1">Department</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 space-y-5 mt-8 max-w-lg">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                            {systemTitle || (
                                <>
                                    Comprehensive <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                        Profiling System
                                    </span>
                                </>
                            )}
                        </h2>
                        
                        <div className="w-16 h-1.5 bg-gradient-to-r from-white/80 to-white/20 rounded-full my-6"></div>
                        
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light">
                            A comprehensive platform for managing and profiling students. 
                            Streamline academic records, track progress, and unlock data-driven insights.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white/40 backdrop-blur-sm transition-colors duration-500">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h3>
                            <p className="text-gray-500 mt-3 font-medium">Sign in with your user ID or email</p>
                        </div>

                        {/* Server error */}
                        {serverError && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-in fade-in duration-300">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Identifier Field */}
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                                    User ID or Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="identifier"
                                        type="text"
                                        value={identifier}
                                        onChange={handleIdentifierChange}
                                        autoComplete="username"
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                                                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                                transition duration-200 bg-[#F9FAFB] text-gray-900
                                                ${identifierError ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                                        placeholder="e.g., 20240001 or student@ccs.edu"
                                    />
                                </div>
                                {identifierError && (
                                    <p className="mt-1 text-sm text-red-600">{identifierError}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        autoComplete="current-password"
                                        className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
                                                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                                transition duration-200 bg-[#F9FAFB] text-gray-900
                                                ${passwordError ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 
                                                 hover:text-brand-500 transition-colors focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5" />
                                        ) : (
                                            <FaEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                                )}
                                <div className="text-right mt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-sm text-brand-500 hover:text-brand-400 transition-colors focus:outline-none"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isProcessing || authLoading}
                                className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-70 disabled:cursor-not-allowed 
                                         text-white font-semibold py-3 px-4 rounded-xl transition duration-200 
                                         transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-500 
                                         focus:ring-offset-2 shadow-md"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <button 
                                    type="button"
                                    onClick={() => setShowContactModal(true)}
                                    className="text-brand-500 font-medium hover:text-brand-400 transition-colors focus:outline-none"
                                >
                                    Contact Administrator
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h3>
                        <p className="text-gray-500 mb-6">Enter your email and we'll send you a link to reset your password.</p>
                        
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl 
                                                 bg-[#F9FAFB] text-gray-900 focus:outline-none focus:ring-2 
                                                 focus:ring-brand-500 transition duration-200"
                                        placeholder="your-email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSendingReset}
                                    className="w-full bg-brand-500 hover:bg-brand-400 text-white font-semibold py-3 rounded-xl 
                                             transition duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="w-full py-3 text-gray-500 hover:text-gray-700 
                                             transition-colors text-center text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Contact Support Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Contact Administrator</h3>
                        <p className="text-gray-500 mb-6">Need an account or having trouble logging in? Send a message to our support team.</p>
                        
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl 
                                                 bg-[#F9FAFB] text-gray-900 focus:outline-none focus:ring-2 
                                                 focus:ring-brand-500 transition duration-200"
                                        placeholder="JC"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl 
                                                 bg-[#F9FAFB] text-gray-900 focus:outline-none focus:ring-2 
                                                 focus:ring-brand-500 transition duration-200"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select
                                    value={contactForm.subject}
                                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl 
                                             bg-[#F9FAFB] text-gray-900 focus:outline-none focus:ring-2 
                                             focus:ring-brand-500 transition duration-200"
                                >
                                    <option value="Account Issue / Access Request">Account Issue / Access Request</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Report a Bug">Report a Bug</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl 
                                             bg-[#F9FAFB] text-gray-900 focus:outline-none focus:ring-2 
                                             focus:ring-brand-500 transition duration-200 resize-none"
                                    placeholder="Tell us what you need help with..."
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSendingContact}
                                    className="w-full bg-brand-500 hover:bg-brand-400 text-white font-semibold py-3 rounded-xl 
                                             transition duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSendingContact ? 'Sending Message...' : 'Send Message'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowContactModal(false)}
                                    className="w-full py-3 text-gray-500 hover:text-gray-700 
                                             transition-colors text-center text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
