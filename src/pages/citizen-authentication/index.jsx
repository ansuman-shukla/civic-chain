import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import { cn } from "utils/cn";

const CitizenAuthentication = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      fullName: '',
      dateOfBirth: '',
      phone: '', // Changed from phoneNumber to phone
      address: {
        line1: '', // Changed from street to line1
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      gender: '',
      occupation: ''
    }
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (!formData.profile.fullName || !formData.profile.phone || !formData.profile.dateOfBirth) {
        setError('Full name, phone number, and date of birth are required');
        return false;
      }
      if (!formData.profile.address.line1 || !formData.profile.address.state) {
        setError('Street address and state are required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            email: formData.email, 
            password: formData.password, 
            profile: formData.profile 
          };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext login function to properly set state
        login(data.user, data.token);
        
        setSuccess(data.message);
        
        // Redirect to dashboard after successful auth
        setTimeout(() => {
          navigate('/citizen-dashboard-grievance-filing');
        }, 1500);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      // Temporary fallback for testing when backend is unavailable
      if (isLogin && formData.email === 'test@example.com' && formData.password === 'password123') {
        const mockUser = {
          id: 'user_123',
          email: 'test@example.com',
          profile: {
            fullName: 'Test User',
            phone: '1234567890'
          },
          verification: {
            aadhaar: false
          }
        };
        const mockToken = 'mock_jwt_token_123';
        
        login(mockUser, mockToken);
        setSuccess('Login successful (using test credentials)');
        
        setTimeout(() => {
          navigate('/citizen-dashboard-grievance-filing');
        }, 1500);
      } else {
        setError('Network error. Please try again. (Use test@example.com / password123 for testing)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stateOptions = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access CivicChain platform to file and track grievances
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <Input
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="Enter your email"
            />

            {/* Password */}
            <Input
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              placeholder="Enter your password"
            />

            {/* Registration fields */}
            {!isLogin && (
              <>
                <Input
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  placeholder="Confirm your password"
                />

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                  
                  <div className="space-y-4">
                    <Input
                      type="text"
                      label="Full Name"
                      value={formData.profile.fullName}
                      onChange={(e) => handleInputChange('profile.fullName', e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />

                    <Input
                      type="date"
                      label="Date of Birth"
                      value={formData.profile.dateOfBirth}
                      onChange={(e) => handleInputChange('profile.dateOfBirth', e.target.value)}
                      placeholder="Select your date of birth"
                    />

                    <Input
                      type="tel"
                      label="Phone Number"
                      value={formData.profile.phone}
                      onChange={(e) => handleInputChange('profile.phone', e.target.value)}
                      required
                      placeholder="Enter your phone number"
                    />

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        value={formData.profile.gender}
                        onChange={(e) => handleInputChange('profile.gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select your gender</option>
                        {genderOptions.map(gender => (
                          <option key={gender} value={gender}>{gender}</option>
                        ))}
                      </select>
                    </div>

                    <Input
                      type="text"
                      label="Occupation"
                      value={formData.profile.occupation}
                      onChange={(e) => handleInputChange('profile.occupation', e.target.value)}
                      placeholder="Enter your occupation"
                    />

                    <h4 className="text-md font-medium text-gray-800 mt-6 mb-3">Address</h4>
                    
                    <Input
                      type="text"
                      label="Street Address"
                      value={formData.profile.address.line1}
                      onChange={(e) => handleInputChange('profile.address.line1', e.target.value)}
                      required
                      placeholder="Enter your street address"
                    />

                    <Input
                      type="text"
                      label="City"
                      value={formData.profile.address.city}
                      onChange={(e) => handleInputChange('profile.address.city', e.target.value)}
                      placeholder="Enter your city"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <select
                        value={formData.profile.address.state}
                        onChange={(e) => handleInputChange('profile.address.state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select your state</option>
                        {stateOptions.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <Input
                      type="text"
                      label="Pincode"
                      value={formData.profile.address.pincode}
                      onChange={(e) => handleInputChange('profile.address.pincode', e.target.value)}
                      placeholder="Enter your pincode"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>

          {/* Toggle between login/register */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Aadhaar Verification Note */}
          {!isLogin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    � Two-Step Verification Process
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      <strong>Step 1:</strong> Register with email/password and profile information<br/>
                      <strong>Step 2:</strong> Complete mandatory Aadhaar Zero-Knowledge Proof verification to access the platform<br/>
                      <em>ZKP verification ensures privacy while preventing spam accounts</em>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CitizenAuthentication;
