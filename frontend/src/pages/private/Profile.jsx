// src/pages/Profile.jsx

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FiUser, FiLock, FiSave, FiEye, FiEyeOff, FiCamera, FiX } from 'react-icons/fi';

const inputClasses = (error, touched, value) => {
  const hasError = error && touched;
  const isValid = touched && !error && value && value.toString().trim() !== '';
  return `w-full h-11 px-4 bg-gray-50 dark:bg-[#18181B] text-gray-900 dark:text-white border ${hasError
      ? 'border-red-500 ring-red-500/10'
      : isValid
        ? 'border-green-500/40 dark:border-green-500/30 bg-green-500/[0.02]'
        : 'border-gray-200 dark:border-gray-800'
    } rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]`;
};

const labelClasses = 'block text-[12px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1';

const formatDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  // Form fields (only used when role is admin)
  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Profile picture states (only used when role is admin)
  const [originalProfilePicture, setOriginalProfilePicture] = useState('');
  const [currentBase64, setCurrentBase64] = useState(null);
  const [displayUrl, setDisplayUrl] = useState('');

  // Modal state (only used when role is admin)
  const [showModal, setShowModal] = useState(false);

  // Password states (always used)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Determine if the user should see the full profile edit (admin) or only password (student/faculty)
  const isRestrictedRole = user?.role === 'student' || user?.role === 'faculty';
  const canEditPersonalInfo = user?.role === 'admin';

  // Load user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    // Only load personal info fields if admin (students and faculty see only password change)
    if (canEditPersonalInfo) {
      setFirstname(user.firstname || '');
      setMiddlename(user.middlename || '');
      setLastname(user.lastname || '');
      setEmail(user.email || '');
      setContactNumber(user.contact_number || '');
      setGender(user.gender || '');
      setAddress(user.address || '');
      setBirthDate(formatDateInput(user.birth_date));
      const originalPic = user.profile_picture || '';
      setOriginalProfilePicture(originalPic);
      setCurrentBase64(null);
      setDisplayUrl(originalPic);
    }
    setLoading(false);
    setFieldErrors({});
    setTouched({});
  }, [user, canEditPersonalInfo]);

  // Cleanup object URL (only when admin)
  useEffect(() => {
    if (canEditPersonalInfo) {
      return () => {
        if (displayUrl && displayUrl.startsWith('blob:')) {
          URL.revokeObjectURL(displayUrl);
        }
      };
    }
  }, [displayUrl, canEditPersonalInfo]);

  // Validation functions
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
      case 'currentPassword':
        if (newPassword || confirmPassword) {
          if (!value) return 'Current password is required when changing password.';
        }
        break;
      case 'newPassword':
        if (currentPassword || confirmPassword) {
          if (!value) return 'New password is required when changing password.';
          if (value.length < 8) return 'Password must be at least 8 characters.';
          if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
          if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.';
          if (!/\d/.test(value)) return 'Password must contain at least one number.';
        }
        break;
      case 'confirmPassword':
        if (currentPassword || newPassword) {
          if (!value) return 'Please confirm your new password.';
          if (value !== newPassword) return 'Passwords do not match.';
        }
        break;
      default:
        break;
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};

    // Only validate personal info if admin
    if (canEditPersonalInfo) {
      const fieldMap = { firstname, lastname, email };
      Object.entries(fieldMap).forEach(([field, value]) => {
        const error = validateField(field, value);
        if (error) errors[field] = error;
      });
    }

    // Always validate password fields if any are filled
    if (currentPassword || newPassword || confirmPassword) {
      const currError = validateField('currentPassword', currentPassword);
      if (currError) errors.currentPassword = currError;
      const newError = validateField('newPassword', newPassword);
      if (newError) errors.newPassword = newError;
      const confirmError = validateField('confirmPassword', confirmPassword);
      if (confirmError) errors.confirmPassword = confirmError;
    }
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
      case 'currentPassword': value = currentPassword; break;
      case 'newPassword': value = newPassword; break;
      case 'confirmPassword': value = confirmPassword; break;
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
    if (['currentPassword', 'newPassword', 'confirmPassword'].includes(field)) {
      setFieldErrors(prev => ({ ...prev, currentPassword: undefined, newPassword: undefined, confirmPassword: undefined }));
    }
  };

  // Profile picture helpers (only used when admin)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {};

      // Only include essential personal info for admin
      if (canEditPersonalInfo) {
        payload.firstname = firstname.trim();
        payload.lastname = lastname.trim();
        payload.email = email.trim().toLowerCase();
        if (currentBase64) {
          payload.profile_picture = currentBase64;
        }
      }

      // Always include password change if provided
      if (newPassword && currentPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await authAPI.updateProfile(payload);
      await refreshUser();

      // Reset password fields and clear unsaved photo state
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentBase64(null);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  // Helper to render field with error handling (only used when admin)
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
      } rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[14px]`;

    return (
      <div className="space-y-2">
        <label className={labelClasses}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            rows={3}
            className={`${inputClass} h-auto py-3 resize-y min-h-[88px]`}
            value={value}
            onChange={(e) => handleFieldChange(setter, field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={placeholder}
          />
        ) : type === 'select' ? (
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

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {isRestrictedRole ? 'Security Settings' : 'My Account'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account information card - only shown for admin */}
        {canEditPersonalInfo && (
          <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
              <CardTitle className="text-[16px] font-bold flex items-center gap-3">
                <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
                  <FiUser className="w-5 h-5 text-brand-500" />
                </div>
                Account information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-gray-100 dark:border-gray-800/50">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 shadow-inner">
                    {displayUrl ? (
                      <img
                        src={displayUrl}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiUser className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerUpload}
                    className="absolute -bottom-2 -right-2 bg-[#FF6B00] hover:bg-[#E66000] text-white p-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 active:scale-90"
                    title="Change photo"
                  >
                    <FiCamera className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-3 text-center sm:text-left">
                  <h4 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Profile Photo</h4>
                  <p className="text-sm text-gray-500 dark:text-zinc-500 leading-relaxed max-w-xs">
                    JPG, PNG or WEBP formats are supported. Max size of 2MB.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={triggerUpload}
                      className="rounded-xl h-9 px-4 text-[13px] border-gray-200 dark:border-gray-800"
                    >
                      Upload New
                    </Button>
                    {hasUnsavedPhoto() && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeProfilePicture}
                        className="rounded-xl h-9 px-4 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses}>
                    User ID <span className="lowercase font-normal opacity-60 italic ml-1">(Read-only)</span>
                  </label>
                  <input type="text" className={inputClasses(false, false, null)} value={user.user_id || ''} disabled readOnly />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>
                    Role <span className="lowercase font-normal opacity-60 italic ml-1">(Read-only)</span>
                  </label>
                  <input type="text" className={inputClasses(false, false, null)} value={user.role || ''} disabled readOnly />
                </div>
                {renderField('First name', 'firstname', 'text', true, 'Enter first name')}
                {renderField('Last name', 'lastname', 'text', true, 'Enter last name')}
                <div className="md:col-span-2">
                  {renderField('Email address', 'email', 'email', true, 'your@email.com')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Change password card - always shown */}
        <Card className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/10">
            <CardTitle className="text-[16px] font-bold flex items-center gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                <FiLock className="w-5 h-5 text-orange-500" />
              </div>
              Change password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Leave password fields empty to keep your current password.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current password */}
              <div className="space-y-2 md:col-span-2">
                <label className={labelClasses}>Current password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={`${inputClasses(!!fieldErrors.currentPassword, touched.currentPassword, currentPassword)} pr-10`}
                    value={currentPassword}
                    onChange={(e) => handleFieldChange(setCurrentPassword, 'currentPassword', e.target.value)}
                    onBlur={() => handleBlur('currentPassword')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.currentPassword && touched.currentPassword && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.currentPassword}</p>
                )}
              </div>

              {/* New password */}
              <div className="space-y-2">
                <label className={labelClasses}>New password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className={`${inputClasses(!!fieldErrors.newPassword, touched.newPassword, newPassword)} pr-10`}
                    value={newPassword}
                    onChange={(e) => handleFieldChange(setNewPassword, 'newPassword', e.target.value)}
                    onBlur={() => handleBlur('newPassword')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {!fieldErrors.newPassword && (newPassword || touched.newPassword) && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Min 8 chars, uppercase, lowercase, number.
                  </p>
                )}
                {fieldErrors.newPassword && touched.newPassword && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label className={labelClasses}>Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`${inputClasses(!!fieldErrors.confirmPassword, touched.confirmPassword, confirmPassword)} pr-10`}
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange(setConfirmPassword, 'confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2 min-w-[160px]">
            <FiSave className="w-4 h-5" />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>

      {/* Hidden file inputs - only used when admin */}
      {canEditPersonalInfo && (
        <>
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
        </>
      )}

      {/* Modal for previewing and uploading new photo - only used when admin */}
      {canEditPersonalInfo && showModal && (
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

export default Profile;