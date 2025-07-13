import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' }
  ];

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (value) => {
    setCurrentLanguage(value);
    localStorage.setItem('selectedLanguage', value);
    
    // In a real application, this would trigger language change across the app
    console.log('Language changed to:', value);
  };

  const getLanguageContent = () => {
    const content = {
      en: {
        title: 'CivicChain',
        subtitle: 'Blockchain-Powered Grievance Platform',
        description: 'Secure, transparent, and efficient citizen-government interaction platform',
        selectLanguage: 'Select Language'
      },
      hi: {
        title: 'सिविकचेन',
        subtitle: 'ब्लॉकचेन-संचालित शिकायत मंच',
        description: 'सुरक्षित, पारदर्शी और कुशल नागरिक-सरकार संपर्क मंच',
        selectLanguage: 'भाषा चुनें'
      },
      ta: {
        title: 'சிவிக்சேன்',
        subtitle: 'பிளாக்செயின்-இயங்கும் புகார் தளம்',
        description: 'பாதுகாப்பான, வெளிப்படையான மற்றும் திறமையான குடிமகன்-அரசு தொடர்பு தளம்',
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்'
      }
    };

    return content[currentLanguage] || content.en;
  };

  const content = getLanguageContent();

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex justify-end">
        <div className="w-48">
          <Select
            placeholder={content.selectLanguage}
            options={languageOptions}
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="text-sm"
          />
        </div>
      </div>

      {/* Platform Branding */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={24} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              {content.title}
            </h1>
            <p className="text-sm text-muted-foreground font-caption">
              {content.subtitle}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground font-body max-w-md mx-auto">
          {content.description}
        </p>

        {/* Government Emblem */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
              <Icon name="Star" size={16} color="white" />
            </div>
            <span className="text-sm font-caption text-muted-foreground">Government of India</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={16} className="text-muted-foreground" />
            <span className="text-sm font-caption text-muted-foreground">Digital India</span>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <Icon name="Zap" size={20} className="text-primary mx-auto mb-2" />
          <h3 className="text-sm font-body font-medium text-foreground">Fast Processing</h3>
          <p className="text-xs text-muted-foreground font-caption">Quick grievance resolution</p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <Icon name="Eye" size={20} className="text-success mx-auto mb-2" />
          <h3 className="text-sm font-body font-medium text-foreground">Transparent</h3>
          <p className="text-xs text-muted-foreground font-caption">Track every step</p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <Icon name="Shield" size={20} className="text-accent mx-auto mb-2" />
          <h3 className="text-sm font-body font-medium text-foreground">Secure</h3>
          <p className="text-xs text-muted-foreground font-caption">Blockchain protected</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;