import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, error: authError, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    setIdentifierError('');
    setServerError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
    setServerError('');
  };

  const validate = () => {
    let isValid = true;

    if (!identifier.trim()) {
      setIdentifierError('Enter your user ID or email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Enter your password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      setServerError('Incorrect username/email or password');
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (authError) {
      setServerError('Incorrect username/email or password');
    } else {
      setServerError('');
    }
  }, [authError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE - Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-brand-500 to-brand-400 p-8 md:p-12 flex flex-col justify-between text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-3xl md:text-4xl text-white/90" />

            </div>
            <div className="space-y-4 mt-8">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                CCS Comprehensive Profiling System
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Secure platform for managing and profiling students of the institution.
                Streamline academic records, track progress, and ensure data-driven insights.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome Back</h3>
              <p className="text-gray-500 mt-2">Sign in with your user ID or email</p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
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
                              transition duration-200 bg-gray-50/50
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
                              transition duration-200 bg-gray-50/50
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
                  <a href="#" className="text-sm text-brand-500 hover:text-brand-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-70 disabled:cursor-not-allowed 
                           text-white font-semibold py-3 px-4 rounded-xl transition duration-200 
                           transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-500 
                           focus:ring-offset-2 shadow-md"
              >
                {isSubmitting ? (
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
                <a href="#" className="text-brand-500 font-medium hover:text-brand-400 transition-colors">
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;