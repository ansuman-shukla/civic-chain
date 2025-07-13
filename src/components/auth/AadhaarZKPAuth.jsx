import React, { useState, useEffect } from 'react';
import { LogInWithAnonAadhaar, useAnonAadhaar, AnonAadhaarProof } from "@anon-aadhaar/react";
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AadhaarZKPAuth = ({ onAuthSuccess, onAuthError, nullifierSeed = 1234 }) => {
  const [anonAadhaar] = useAnonAadhaar();
  const [isLoading, setIsLoading] = useState(false);
  const [userVerified, setUserVerified] = useState(false);

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
    
    if (anonAadhaar?.status === "logged-in") {
      handleSuccessfulAuth();
    }
  }, [anonAadhaar]);

  const handleSuccessfulAuth = async () => {
    setIsLoading(true);
    
    try {
      // Extract proof data
      const proofData = {
        nullifier: anonAadhaar.pcd?.proof?.nullifier,
        timestamp: anonAadhaar.pcd?.proof?.timestamp,
        ageAbove18: anonAadhaar.pcd?.proof?.ageAbove18,
        gender: anonAadhaar.pcd?.proof?.gender,
        state: anonAadhaar.pcd?.proof?.state,
        pincode: anonAadhaar.pcd?.proof?.pincode,
        signalHash: anonAadhaar.pcd?.proof?.signalHash,
        verified: true,
        verificationTime: new Date().toISOString()
      };

      // Create user profile from ZKP
      const userProfile = {
        id: proofData.nullifier, // Use nullifier as unique user ID
        verified: true,
        aadhaarVerified: true,
        ageVerified: proofData.ageAbove18 === "1",
        registrationDate: proofData.verificationTime,
        lastLogin: proofData.verificationTime,
        zkProof: proofData
      };

      // Store user data (in production, this would be in your database)
      localStorage.setItem(`zkp_user_${proofData.nullifier}`, JSON.stringify(userProfile));
      localStorage.setItem('currentUser', JSON.stringify(userProfile));
      
      setUserVerified(true);
      onAuthSuccess(userProfile);
    } catch (error) {
      console.error('ZKP Authentication error:', error);
      onAuthError('Failed to process Aadhaar verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthStatus = () => {
    switch (anonAadhaar?.status) {
      case "logged-out":
        return (
          <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Verify Your Identity
              </h2>
              <p className="text-muted-foreground mb-6 font-body">
                Securely verify your Aadhaar identity using Zero-Knowledge Proof technology. 
                Your Aadhaar number remains completely private.
              </p>
              
              {/* Anon Aadhaar Login Button */}
              <div className="mb-6">
                <LogInWithAnonAadhaar 
                  nullifierSeed={nullifierSeed}
                  fieldsToReveal={["revealAgeAbove18", "revealGender", "revealState", "revealPinCode"]}
                />
              </div>

              {/* Security Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="font-body">Zero-Knowledge Proof Verification</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Icon name="Lock" size={16} className="text-success" />
                  <span className="font-body">Complete Privacy Protection</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Icon name="Eye" size={16} className="text-success" />
                  <span className="font-body">Blockchain Secured Records</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-caption">
                By verifying, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        );

      case "logging-in":
        return (
          <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Loader" size={32} color="white" className="animate-spin" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Verifying Identity
              </h2>
              <p className="text-muted-foreground mb-6 font-body">
                Processing your Aadhaar verification. This may take a few moments...
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-caption">Generating Zero-Knowledge Proof</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "logged-in":
        return (
          <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Identity Verified!
              </h2>
              <p className="text-muted-foreground mb-6 font-body">
                Your Aadhaar identity has been successfully verified using Zero-Knowledge Proof.
              </p>
              
              {/* Verification Details */}
              {anonAadhaar.pcd?.proof && (
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age Verified:</span>
                      <span className="text-foreground font-medium">
                        {anonAadhaar.pcd.proof.ageAbove18 === "1" ? "18+" : "Under 18"}
                      </span>
                    </div>
                    {anonAadhaar.pcd.proof.gender && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="text-foreground font-medium">
                          {anonAadhaar.pcd.proof.gender === "77" ? "Male" : "Female"}
                        </span>
                      </div>
                    )}
                    {anonAadhaar.pcd.proof.pincode && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pincode:</span>
                        <span className="text-foreground font-medium">
                          {anonAadhaar.pcd.proof.pincode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="default"
                onClick={() => onAuthSuccess(userVerified)}
                loading={isLoading}
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
                fullWidth
              >
                {isLoading ? 'Setting up account...' : 'Continue to Dashboard'}
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={32} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Verification Required
              </h2>
              <p className="text-muted-foreground font-body">
                Please complete Aadhaar verification to continue.
              </p>
            </div>
          </div>
        );
    }
  };

  return renderAuthStatus();
};

export default AadhaarZKPAuth;
