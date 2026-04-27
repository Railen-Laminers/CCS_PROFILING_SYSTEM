// src/pages/faculty/MyDetails.jsx (or similar path)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiSave, FiLoader, FiCamera, FiX
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { authAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Reusable styling (same as student form)
const labelClasses = 'block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1';

const inputClasses = (error, touched, value) => {
  const hasError = error && touched;
  const isValid = touched && !error && value && value.toString().trim() !== '';
  return `w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border ${hasError
      ? 'border-red-500 ring-red-500/10'
      : isValid
        ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]'
        : 'border-gray-200 dark:border-gray-800'
    } rounded-xl focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]`;
};

const formatDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export const MyDetails = () => {
  const navigate = useNavigate();
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  // ---------- Form fields ----------
  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Profile picture states
  const [originalProfilePicture, setOriginalProfilePicture] = useState('');
  const [currentBase64, setCurrentBase64] = useState(null);
  const [displayUrl, setDisplayUrl] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Validation states
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ---------- Load user data ----------
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setFirstname(currentUser.firstname || '');
    setMiddlename(currentUser.middlename || '');
    setLastname(currentUser.lastname || '');
    setEmail(currentUser.email || '');
    setContactNumber(currentUser.contact_number || '');
    setGender(currentUser.gender || '');
    setAddress(currentUser.address || '');
    setBirthDate(formatDateInput(currentUser.birth_date));

    const originalPic = currentUser.profile_picture || '';
    setOriginalProfilePicture(originalPic);
    setCurrentBase64(null);
    setDisplayUrl(originalPic);

    setLoading(false);
    setFieldErrors({});
    setTouched({});
  }, [currentUser]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (displayUrl && displayUrl.startsWith('blob:')) {
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [displayUrl]);

  // ---------- Validation ----------
  const validateField = (name, value) => {
    switch (name) {
      case 'firstname':
        if (!value?.trim()) return 'First name is required.';
        if (value.length > 255) return 'Maximum 255 characters.';
        break;
      case 'lastname':
        if (!value?.trim()) return 'Last name is required.';
        if (value.length > 255) return 'Maximum 255 characters.';
        break;
      case 'email':
        if (!value?.trim()) return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format.';
        break;
      case 'contactNumber':
        if (value && !/^(\+?63|0)[9]\d{9}$/.test(value.replace(/\s/g, ''))) {
          return 'Invalid Philippine mobile number (e.g., 09123456789 or +639123456789).';
        }
        break;
      default:
        break;
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    const fieldsToValidate = { firstname, lastname, email, contactNumber };
    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let value;
    switch (field) {
      case 'firstname': value = firstname; break;
      case 'lastname': value = lastname; break;
      case 'email': value = email; break;
      case 'contactNumber': value = contactNumber; break;
      default: return;
    }
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleFieldChange = (setter, field, value) => {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // ---------- Profile picture helpers ----------
  const hasUnsavedPhoto = () => currentBase64 !== null;

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        reject('Only JPEG, PNG, WEBP images are allowed.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        reject('Image size must be less than 2MB.');
        return;
      }
      if (displayUrl && displayUrl.startsWith('blob:')) {
        URL.revokeObjectURL(displayUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => resolve({ base64: reader.result, objectUrl });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { base64, objectUrl } = await processFile(file);
      setCurrentBase64(base64);
      setDisplayUrl(objectUrl);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleModalFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { base64, objectUrl } = await processFile(file);
      setCurrentBase64(base64);
      setDisplayUrl(objectUrl);
      setShowModal(false);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      if (modalFileInputRef.current) modalFileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    if (!originalProfilePicture && !currentBase64) {
      fileInputRef.current?.click();
    } else {
      setShowModal(true);
    }
  };

  const removeProfilePicture = () => {
    if (!hasUnsavedPhoto()) return;
    if (displayUrl && displayUrl.startsWith('blob:')) {
      URL.revokeObjectURL(displayUrl);
    }
    setCurrentBase64(null);
    setDisplayUrl(originalProfilePicture);
    showToast('New photo discarded. Original restored.', 'info');
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        firstname: firstname.trim(),
        middlename: middlename.trim() || null,
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        contact_number: contactNumber.trim() || null,
        gender: gender || null,
        address: address.trim() || null,
        birth_date: birthDate || null,
      };

      if (currentBase64) {
        payload.profile_picture = currentBase64;
      }

      await authAPI.updateProfile(payload);
      await refreshUser();

      setCurrentBase64(null);
      showToast('Faculty information updated successfully.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update information';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Helper to render a field (reduces repetition)
  const renderField = (label, field, type = 'text', required = false, placeholder = '') => {
    let value, setter, error, isTouched;
    switch (field) {
      case 'firstname': value = firstname; setter = setFirstname; error = fieldErrors.firstname; isTouched = touched.firstname; break;
      case 'middlename': value = middlename; setter = setMiddlename; error = fieldErrors.middlename; isTouched = touched.middlename; break;
      case 'lastname': value = lastname; setter = setLastname; error = fieldErrors.lastname; isTouched = touched.lastname; break;
      case 'email': value = email; setter = setEmail; error = fieldErrors.email; isTouched = touched.email; break;
      case 'contactNumber': value = contactNumber; setter = setContactNumber; error = fieldErrors.contactNumber; isTouched = touched.contactNumber; break;
      case 'gender': value = gender; setter = setGender; error = fieldErrors.gender; isTouched = touched.gender; break;
      case 'address': value = address; setter = setAddress; error = fieldErrors.address; isTouched = touched.address; break;
      case 'birthDate': value = birthDate; setter = setBirthDate; error = fieldErrors.birthDate; isTouched = touched.birthDate; break;
      default: return null;
    }

    const hasError = error && isTouched;
    const isValid = isTouched && !error && value && value.toString().trim() !== '';
    const inputClass = `w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border ${hasError ? 'border-red-500 ring-red-500/10' : isValid ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]' : 'border-gray-200 dark:border-gray-800'
      } rounded-xl focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]`;

    return (
      <div className="space-y-2">
        <label className={labelClasses}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'select' ? (
          <select
            className={inputClass}
            value={value}
            onChange={(e) => handleFieldChange(setter, field, e.target.value)}
            onBlur={() => handleBlur(field)}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        ) : type === 'textarea' ? (
          <textarea
            rows={3}
            className={`${inputClass} h-auto py-3 resize-y min-h-[88px]`}
            value={value}
            onChange={(e) => handleFieldChange(setter, field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            className={inputClass}
            value={value}
            onChange={(e) => handleFieldChange(setter, field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={placeholder}
          />
        )}
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-[#ff6b00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            My Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Update your personal and professional information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Card */}
          <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
              <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                <div className="bg-[#ff6b00]/10 p-2 rounded-lg border border-[#ff6b00]/20">
                  <FiUser className="w-5 h-5 text-[#ff6b00]" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-start gap-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="relative">
                  <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    {displayUrl ? (
                      <img
                        src={displayUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/112?text=Error';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiUser className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerUpload}
                    className="absolute bottom-0 right-0 bg-[#ff6b00] hover:bg-orange-600 text-white p-1.5 rounded-full shadow-md transition-colors"
                    title="Upload photo"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profile Photo
                  </div>
                  <div className="flex gap-2">
                    {hasUnsavedPhoto() && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeProfilePicture}
                        className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                      >
                        <FiX className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    JPG, PNG or WEBP. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Faculty ID (read‑only) */}
                <div className="space-y-2">
                  <label className={labelClasses}>Faculty ID</label>
                  <input
                    type="text"
                    className={inputClasses(false, false, null)}
                    value={currentUser.user_id || ''}
                    disabled
                    readOnly
                  />
                </div>

                {renderField('First name', 'firstname', 'text', true, 'Enter first name')}
                {renderField('Middle name', 'middlename', 'text', false, 'Enter middle name (optional)')}
                {renderField('Last name', 'lastname', 'text', true, 'Enter last name')}
                {renderField('Email', 'email', 'email', true, 'your@email.com')}
                {renderField('Contact number', 'contactNumber', 'tel', false, '09XXXXXXXXX')}
                {renderField('Gender', 'gender', 'select')}
                {renderField('Birth date', 'birthDate', 'date')}
                <div className="md:col-span-2">
                  {renderField('Complete address', 'address', 'textarea', false, 'Street, Barangay, City, Province, Zip Code')}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2 min-w-[160px] bg-[#ff6b00] hover:bg-orange-600">
              <FiSave className="w-4 h-5" />
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={modalFileInputRef}
        onChange={handleModalFileSelect}
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />

      {/* Profile picture modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img
                  src={displayUrl}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                onClick={() => modalFileInputRef.current?.click()}
                variant="outline"
                className="gap-2"
              >
                <FiCamera className="w-4 h-4" />
                Upload New Photo
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Click the button to choose a new image (JPG, PNG, WEBP, max 2MB).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDetails;