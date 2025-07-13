import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    twoFactorCode: ''
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (showTwoFactor && !formData.twoFactorCode) {
      newErrors.twoFactorCode = 'Two-factor authentication code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    // Mock admin credentials
    const validCredentials = [
      { email: 'admin1@gmail.com', password: 'Admin@123' },
      { email: 'admin2@gmail.com', password: 'Admin@456' }
    ];

    const isValidCredential = validCredentials.some(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (!isValidCredential) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setErrors({ general: 'Account locked due to multiple failed attempts. Please contact system administrator.' });
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, 300000); // 5 minutes lockout
      } else {
        setErrors({ 
          general: `Invalid credentials. ${3 - newAttempts} attempts remaining.` 
        });
      }
      return;
    }

    if (!showTwoFactor) {
      setShowTwoFactor(true);
      return;
    }

    // Mock 2FA validation
    if (formData.twoFactorCode !== '123456') {
      setErrors({ twoFactorCode: 'Invalid authentication code. Use 123456 for demo.' });
      return;
    }

    // Successful login
    const adminData = {
      email: formData.email,
      name: formData.email === 'admin1@gmail.com' ? 'Admin One' : 'Admin Two',
      department: 'Central Administration',
      role: 'Super Administrator',
      lastLogin: new Date().toISOString()
    };

    onLogin(adminData, formData.rememberMe);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-government-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Admin Portal Access
          </h1>
          <p className="text-sm font-body text-muted-foreground">
            Secure authentication for authorized personnel only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <p className="text-sm font-body text-red-700">{error}</p>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-red-600" />
              <p className="text-sm font-body text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        {isLocked && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-yellow-600" />
              <p className="text-sm font-body text-yellow-700">
                Account temporarily locked. Please wait 5 minutes before trying again.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!showTwoFactor ? (
            <>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin1@gmail.com | admin2@gmail.com"
                error={errors.email}
                required
                disabled={isLocked}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Admin@123 | Admin@456"
                error={errors.password}
                required
                disabled={isLocked}
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  name="rememberMe"
                  disabled={isLocked}
                />
                <a href="#" className="text-sm font-body text-primary hover:text-primary/80 transition-government">
                  Forgot password?
                </a>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Icon name="Smartphone" size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-body text-foreground mb-1">
                  Two-Factor Authentication
                </p>
                <p className="text-xs font-caption text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <Input
                label="Authentication Code"
                type="text"
                name="twoFactorCode"
                value={formData.twoFactorCode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                error={errors.twoFactorCode}
                description="Demo code: 123456"
                required
                maxLength={6}
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTwoFactor(false)}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
                type="button"
                fullWidth
              >
                Back to Login
              </Button>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isLoading}
            disabled={isLocked}
            iconName={showTwoFactor ? "Shield" : "LogIn"}
            iconPosition="left"
            iconSize={20}
            fullWidth
          >
            {showTwoFactor ? 'Verify & Access Portal' : 'Sign In Securely'}
          </Button>
        </form>

        {loginAttempts > 0 && loginAttempts < 3 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-caption text-yellow-700 text-center">
              {3 - loginAttempts} login attempts remaining
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs font-caption text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={12} />
              <span>Monitored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-body font-medium text-blue-900 mb-2">Demo Credentials:</h4>
        <div className="space-y-1 text-xs font-caption text-blue-700">
          <p>Email: admin1@gmail.com | Password: Admin@123</p>
          <p>Email: admin2@gmail.com | Password: Admin@456</p>
          <p>2FA Code: 123456</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;