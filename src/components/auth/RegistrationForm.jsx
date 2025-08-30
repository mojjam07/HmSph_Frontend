import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Home, Shield, Mail, Phone, Lock, Building, FileText, Users, IdCard, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

// Mock API function
const register = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (data.email === 'error@test.com') throw new Error('Email already exists');
  return { success: true, message: 'Registration successful' };
};

// Enhanced Input Component
const Input = ({ label, name, type, placeholder, value, onChange, required, error, icon: Icon, className = "" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
        isFocused ? 'text-blue-600' : 'text-gray-700'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-blue-600' : 'text-gray-400'
          }`} />
        )}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${type === 'password' ? 'pr-12' : 'pr-4'} py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            error 
              ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500' 
              : isFocused
                ? 'border-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-lg scale-[1.01]'
                : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 hover:border-gray-300 hover:bg-white'
          } ${className}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center mt-2 text-red-600 text-sm animate-in slide-in-from-left duration-300">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

// Enhanced Button Component
const Button = ({ children, onClick, disabled, className = "" }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = (e) => {
    if (disabled) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    if (onClick) onClick(e);
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden group transition-all duration-300 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-105 hover:shadow-lg active:scale-95'
      } ${className}`}
    >
      <div className={`transition-transform duration-300 ${
        isClicked ? 'scale-110' : 'scale-100'
      }`}>
        {children}
      </div>
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};

// Role Selection Component
const RoleSelection = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roles = [
    {
      id: 'user',
      title: 'Property Seeker',
      description: 'Find your dream property',
      icon: Home,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      textColor: 'text-green-700'
    },
    {
      id: 'agent',
      title: 'Real Estate Agent',
      description: 'List and manage properties',
      icon: Building,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'System administration',
      icon: Shield,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setTimeout(() => onSelectRole(roleId), 300);
  };

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
        <p className="text-xl text-gray-600">Select how you'll be using our platform</p>
      </div>
      
      <div className="grid gap-6 max-w-2xl mx-auto">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              className={`relative cursor-pointer transition-all duration-500 delay-${index * 100} ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedRole === role.id 
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                  : `border-gray-200 ${role.bgColor}`
              }`}>
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg mr-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 ${selectedRole === role.id ? 'text-blue-700' : role.textColor}`}>
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-lg">{role.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    selectedRole === role.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === role.id && (
                      <CheckCircle className="w-6 h-6 text-white -m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    licenseNumber: '',
    yearsOfExperience: '',
    department: '',
    employeeId: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setTimeout(() => setStep(2), 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 2) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (role !== 'admin') {
        if (!formData.phone) newErrors.phone = 'Phone number is required';
      }
    }
    
    if (currentStep === 3) {
      if (role === 'agent') {
        if (!formData.businessName) newErrors.businessName = 'Business name is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
      }
      
      if (role === 'admin') {
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'user': return 'Property Seeker';
      case 'agent': return 'Real Estate Agent';
      case 'admin': return 'Administrator';
      default: return '';
    }
  };

  const handleRegistration = async () => {
    setSubmitting(true);
    setMessage('');
    
    try {
      let registrationData = {
        role: role,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password
      };
      
      if (role === 'agent') {
        registrationData.phone = formData.phone;
        registrationData.businessName = formData.businessName;
        registrationData.licenseNumber = formData.licenseNumber;
        registrationData.yearsOfExperience = formData.yearsOfExperience;
      } else if (role === 'admin') {
        registrationData.department = formData.department;
        registrationData.employeeId = formData.employeeId;
      } else {
        registrationData.phone = formData.phone;
      }
      
      await register(registrationData);
      setMessage('Registration successful! You can now log in.');
      console.log('Registration result:', registrationData);
    } catch (error) {
      setMessage('Registration failed: ' + error.message);
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <RoleSelection onSelectRole={handleRoleSelect} />;
      
      case 2:
        return (
          <div className={`max-w-lg mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                icon={Mail}
              />
              
              {role !== 'admin' && (
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  required={role !== 'admin'}
                  icon={Phone}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                  icon={User}
                />
                
                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                  icon={User}
                />
              </div>
              
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                icon={Lock}
              />
              
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                icon={Lock}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className={`max-w-lg mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
                role === 'agent' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-purple-500 to-violet-600'
              }`}>
                {role === 'agent' ? <Building className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional Details</h2>
              <p className="text-gray-600">Additional information for {getRoleTitle()}</p>
            </div>
            
            <div className="space-y-4">
              {role === 'agent' && (
                <>
                  <Input
                    label="Business Name"
                    name="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    error={errors.businessName}
                    required
                    icon={Building}
                  />
                  
                  <Input
                    label="License Number"
                    name="licenseNumber"
                    type="text"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    error={errors.licenseNumber}
                    required
                    icon={FileText}
                  />
                  
                  <Input
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    placeholder="Enter years of experience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    icon={Users}
                  />
                </>
              )}
              
              {role === 'admin' && (
                <>
                  <Input
                    label="Department"
                    name="department"
                    type="text"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={handleInputChange}
                    error={errors.department}
                    required
                    icon={Users}
                  />
                  
                  <Input
                    label="Employee ID"
                    name="employeeId"
                    type="text"
                    placeholder="Enter your employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    error={errors.employeeId}
                    required
                    icon={IdCard}
                  />
                </>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className={`max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600">Please verify your details before submitting</p>
            </div>
            
            {/* Account Information Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6 mb-6 transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Role</p>
                  <p className="font-bold text-gray-900">{getRoleTitle()}</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Email</p>
                  <p className="font-bold text-gray-900">{formData.email}</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Name</p>
                  <p className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                </div>
                {role !== 'admin' && (
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-semibold">Phone</p>
                    <p className="font-bold text-gray-900">{formData.phone}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Role-specific Information Cards */}
            {role === 'agent' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-100 p-6 mb-6 transform hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="w-6 h-6 mr-3 text-green-600" />
                  Agent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-semibold">Business Name</p>
                    <p className="font-bold text-gray-900">{formData.businessName || 'Not provided'}</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-semibold">License Number</p>
                    <p className="font-bold text-gray-900">{formData.licenseNumber || 'Not provided'}</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 md:col-span-2">
                    <p className="text-sm text-gray-500 font-semibold">Years of Experience</p>
                    <p className="font-bold text-gray-900">{formData.yearsOfExperience || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {role === 'admin' && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl shadow-sm border border-purple-100 p-6 mb-6 transform hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-purple-600" />
                  Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-semibold">Department</p>
                    <p className="font-bold text-gray-900">{formData.department}</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-semibold">Employee ID</p>
                    <p className="font-bold text-gray-900">{formData.employeeId}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-2xl border-2 transition-all duration-500 animate-in slide-in-from-top mb-6 ${
                message.includes('successful') 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {message.includes('successful') ? (
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                  )}
                  <p className="font-semibold text-lg">{message}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    if (step === 1) return null;
    
    const steps = ['Role', 'Personal', 'Details', 'Review'];
    const currentStepIndex = step - 1;
    
    return (
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          {steps.map((stepName, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStepIndex;
            const isCurrent = stepNumber === currentStepIndex;
            
            return (
              <div key={index} className="flex flex-col items-center z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 transform ${
                  isActive 
                    ? isCurrent 
                      ? 'bg-blue-600 text-white border-4 border-blue-200 scale-110 shadow-lg' 
                      : 'bg-green-500 text-white border-4 border-green-200 shadow-md'
                    : 'bg-white text-gray-400 border-4 border-gray-200 hover:border-gray-300'
                }`}>
                  {isActive && !isCurrent ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-bold text-lg">{stepNumber}</span>
                  )}
                </div>
                <span className={`text-sm font-semibold transition-colors duration-300 ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {stepName}
                </span>
              </div>
            );
          })}
          
          {/* Progress line background */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full -z-10"></div>
          
          {/* Progress line fill */}
          <div 
            className="absolute top-6 left-6 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full -z-10 transition-all duration-700 ease-out"
            style={{ width: `calc(${((currentStepIndex - 1) / (steps.length - 1)) * 100}% - 1.5rem)` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        {step > 1 && (
          <div className="mb-8">
            <Button
              onClick={prevStep}
              className="flex items-center text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
        )}
        
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            {renderStep()}
            
            {/* Navigation Buttons */}
            {step > 1 && step < 4 && (
              <div className="mt-12 flex justify-between max-w-lg mx-auto">
                <Button
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-300"
                >
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  {step === 3 ? 'Review' : 'Next'}
                </Button>
              </div>
            )}
            
            {/* Submit Button */}
            {step === 4 && (
              <div className="mt-12 max-w-lg mx-auto">
                <Button
                  onClick={handleRegistration}
                  disabled={submitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Create Account
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;