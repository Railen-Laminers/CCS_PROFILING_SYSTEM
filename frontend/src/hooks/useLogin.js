import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from '../contexts/ToastContext';
import { authAPI, contactAPI } from '../services/api';

export const useLogin = () => {
  const { login, error: authError, loading: authLoading, isProcessing } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  
  // Contact Support State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Account Issue / Access Request',
    message: ''
  });
  const [isSendingContact, setIsSendingContact] = useState(false);
  
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  // Clear any stale errors when login page mounts
  useEffect(() => {
    setServerError('');
  }, []);

  // Sync authError from context
  useEffect(() => {
    if (authError) {
      setServerError('Incorrect username/email or password');
    } else {
      setServerError('');
    }
  }, [authError]);

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
    if (e) e.preventDefault();
    if (!validate()) return;

    setServerError('');

    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      setServerError('Incorrect username/email or password');
    }
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setIsSendingReset(true);
    try {
      await authAPI.forgotPassword(forgotEmail);
      showToast('Password reset link sent to your email!', 'success');
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send reset link', 'error');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleContactSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSendingContact(true);
    try {
      await contactAPI.sendInquiry(contactForm);
      showToast('Your message has been sent to the administrator!', 'success');
      setShowContactModal(false);
      setContactForm({
        name: '',
        email: '',
        subject: 'Account Issue / Access Request',
        message: ''
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setIsSendingContact(false);
    }
  };

  return {
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
    setIdentifier,
    setPassword,
    setShowPassword,
    setShowForgotModal,
    setForgotEmail,
    setShowContactModal,
    setContactForm,
    handleIdentifierChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
    handleForgotPassword,
    handleContactSubmit
  };
};
