import React, { useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
// import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";

const AadhaarVerificationPanel = () => {
  const { user, updateUser } = useAuth();
  // const [anonAadhaar] = useAnonAadhaar(); // Original ZKP hook
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  // COMMENTED OUT: Original ZKP verification useEffect for after hackathon
  /*
  React.useEffect(() => {
    console.log("Anon Aadhaar status:", anonAadhaar.status);
    
    if (anonAadhaar.status === "logged-in" && anonAadhaar.anonAadhaarProof) {
      handleOriginalAadhaarVerification();
    }
  }, [anonAadhaar]);

  const handleOriginalAadhaarVerification = async () => {
    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const zkProof = {
        nullifier: anonAadhaar.anonAadhaarProof.proof.nullifier,
        ageAbove18: anonAadhaar.anonAadhaarProof.proof.ageAbove18,
        gender: anonAadhaar.anonAadhaarProof.proof.gender,
        state: anonAadhaar.anonAadhaarProof.proof.state,
        pincode: anonAadhaar.anonAadhaarProof.proof.pincode,
        signalHash: anonAadhaar.anonAadhaarProof.proof.signalHash,
        timestamp: anonAadhaar.anonAadhaarProof.proof.timestamp
      };

      const response = await fetch('http://localhost:3001/api/auth/verify-aadhaar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ zkProof })
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setSuccess('Aadhaar verification successful! Your account now has enhanced security.');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  */

  // DEMO/HACKATHON: Mock verification with QR upload

  const handleQRUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsVerifying(true);
    setError('');
    setSuccess('');
    setShowAnimation(true);

    // Simulate verification process with progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful verification
    const mockVerifiedUser = {
      ...user,
      verification: {
        ...user.verification,
        aadhaar: true
      },
      aadhaarZKP: {
        verified: true,
        verificationDate: new Date().toISOString(),
        zkProof: {
          ageAbove18: "1",
          gender: "M",
          state: "Karnataka", 
          pincode: "560001"
        }
      }
    };

    updateUser(mockVerifiedUser);
    setSuccess('🎉 Aadhaar verification successful! Your account is now verified.');
    setIsVerifying(false);
    setShowAnimation(false);
    setUploadProgress(0);
  };

  if (user?.verification?.aadhaar) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Icon name="Check" size={20} color="white" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 flex items-center">
              <Icon name="Shield" size={16} className="mr-2 text-green-600" />
              Aadhaar Verified
              <div className="ml-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center" title="Verified Account">
                <Icon name="Check" size={10} color="white" />
              </div>
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p className="flex items-center">
                <Icon name="User" size={14} className="mr-1" />
                Your account is verified with Aadhaar using Zero-Knowledge Proof technology.
              </p>
              <p className="mt-1 flex items-center">
                <Icon name="Calendar" size={14} className="mr-1" />
                <strong>Verified on:</strong> {new Date(user.aadhaarZKP?.verificationDate).toLocaleDateString()}
              </p>
              {user.aadhaarZKP?.zkProof && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-600">
                    <Icon name="MapPin" size={12} className="inline mr-1" />
                    State: {user.aadhaarZKP.zkProof.state} | Pincode: {user.aadhaarZKP.zkProof.pincode}
                  </p>
                  <p className="text-xs text-green-600">
                    <Icon name="User" size={12} className="inline mr-1" />
                    Age: 18+ Verified | Gender: {user.aadhaarZKP.zkProof.gender === 'M' ? 'Male' : 'Female'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon name="Shield" size={20} className="text-blue-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Verify Your Aadhaar Identity
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p className="mb-3">
              Get a verified badge by uploading your Aadhaar QR code. This verification:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Keeps your Aadhaar number completely private</li>
              <li>Prevents spam and fake grievances</li>
              <li>Gives you a verified badge like Twitter</li>
              <li>Uses Zero-Knowledge Proof technology</li>
            </ul>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-3 flex items-center">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                {success}
              </div>
            )}

            {/* Verification Animation */}
            {showAnimation && (
              <div className="mb-4 p-4 bg-white border border-blue-200 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-blue-600 font-medium">Verifying Aadhaar QR Code...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-200" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress}% Complete</p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {isVerifying ? (
                <Button disabled className="w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Verification...
                </Button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRUpload}
                    className="hidden"
                    id="qr-upload"
                  />
                  <label
                    htmlFor="qr-upload"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer flex items-center justify-center transition-colors"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Upload Aadhaar QR Code
                  </label>
                  <p className="text-xs text-blue-600 text-center">
                    📱 Upload a photo of your Aadhaar QR code for instant verification
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* COMMENTED OUT: Original ZKP verification UI for after hackathon
  
  if (user?.verification?.aadhaar) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Aadhaar Verified
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Your account is verified with Aadhaar using Zero-Knowledge Proof technology.</p>
              <p className="mt-1">
                <strong>Verified on:</strong> {new Date(user.aadhaarZKP?.verificationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Optional Aadhaar Verification
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p className="mb-3">
              Enhance your account security and help prevent spam by verifying your Aadhaar 
              using Zero-Knowledge Proof technology. This verification:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Keeps your Aadhaar number completely private</li>
              <li>Prevents spam and fake grievances</li>
              <li>Enables priority support</li>
              <li>Uses cryptographic proofs for verification</li>
            </ul>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-3">
                {success}
              </div>
            )}

            <div className="mt-4">
              {isVerifying ? (
                <Button disabled className="w-full">
                  Verifying...
                </Button>
              ) : (
                <LogInWithAnonAadhaar 
                  nullifierSeed={123456789}
                  fieldsToReveal={["revealAgeAbove18", "revealGender", "revealState", "revealPinCode"]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  */
};

export default AadhaarVerificationPanel;
