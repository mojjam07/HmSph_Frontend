import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

// Enhanced Input Component
const Input = ({ label, name, type, placeholder, value, onChange, required, error, icon: Icon, className = "" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className="mb-4 sm:mb-6">
      <label className={`block text-xs sm:text-sm font-semibold mb-2 transition-colors duration-200 ${
        isFocused ? 'text-white' : 'text-gray-200'
      }`}>
        {label} {required && <span className="text-yellow-300">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
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
          className={`w-full ${Icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'} ${type === 'password' ? 'pr-10 sm:pr-12' : 'pr-3 sm:pr-4'} py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            error 
              ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500' 
              : isFocused
                ? 'border-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-lg scale-[1.02]'
                : 'border-gray-200 bg-white/95 text-gray-900 placeholder-gray-500 hover:border-gray-300'
          } ${className}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center mt-2 text-red-300 text-xs sm:text-sm animate-in slide-in-from-left duration-300">
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}
    </div>
  );
};

// Enhanced Button Component
const Button = ({ children, type = "button", disabled, onClick, className = "" }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    if (onClick) onClick(e);
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden group transition-all duration-300 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-105 hover:shadow-2xl active:scale-95'
      } ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 transition-transform duration-300 ${
        isClicked ? 'scale-110' : 'scale-100'
      }`} />
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Clear errors as user types
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
    if (message.includes('Error')) {
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setMessage('');
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setMessage('Login successful! Redirecting...');

        // Navigate to landing page
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setMessage(`Error: ${errorMessage}`);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Animated background elements - responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
      
      <div className={`relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Glass morphism container - responsive padding and border radius */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl p-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
            <div className="h-full w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl" />
          </div>
          
          <div className="relative z-10">
            {/* Header - responsive text sizes and spacing */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1 sm:mb-2">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-gray-300">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
                icon={Mail}
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
                icon={Lock}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-gray-900 shadow-lg transition-all duration-300 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base">Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Message Display - responsive text and padding */}
            {message && (
              <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-500 animate-in slide-in-from-top ${
                message.includes('Error') 
                  ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                  : 'bg-green-500/10 border-green-500/30 text-green-300'
              }`}>
                <div className="flex items-start sm:items-center">
                  {message.includes('Error') ? (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
