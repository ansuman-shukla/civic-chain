# Changelog

All notable changes to the CivicChain project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-13

### Added
- Complete email/password authentication system with JWT tokens
- Mandatory Aadhaar Zero-Knowledge Proof (ZKP) verification for all users
- User registration with comprehensive profile collection
- MongoDB integration with user and grievance schemas
- Unified navigation system across all pages
- National public leaderboard for grievance transparency
- State-specific performance dashboards
- Comprehensive admin dashboard with analytics
- Citizen dashboard for grievance filing and tracking
- Zero-knowledge proof authentication using Anon Aadhaar v2.4.3
- Real-time grievance status tracking
- Department performance metrics and analytics
- Mobile-responsive design with TailwindCSS
- Form validation and error handling
- Background processes for data aggregation

### Security
- JWT-based authentication with 7-day token expiry
- Password hashing using bcryptjs with salt rounds
- Zero-knowledge proof verification preventing spam accounts
- Nullifier-based duplicate prevention for Aadhaar verification
- Secure API endpoints with authentication middleware
- Input validation and sanitization

### Technical Stack
- **Frontend**: React 18.2.0, Vite 5.0.0, TailwindCSS, React Router DOM
- **Backend**: Express.js, MongoDB, JWT, bcryptjs
- **ZKP**: Anon Aadhaar packages for privacy-preserving verification
- **Database**: MongoDB with comprehensive schemas for users and grievances
- **Development**: Hot reload, environment configuration, CORS setup

### Removed
- MetaMask wallet authentication (completely removed)
- All wallet-related functionality and dependencies
- Rocket AI platform references (cleaned up from codebase)
- Duplicate navigation components
- Legacy authentication flows

### Fixed
- Dropdown selection issues in registration forms
- Duplicate navbar display across pages
- MongoDB duplicate key errors on walletAddress field
- Form validation for required profile fields
- Navigation consistency across all routes
- Database index conflicts and cleanup

### Changed
- Aadhaar ZKP verification changed from optional to mandatory
- User schema updated to require ZKP nullifier for all users
- Grievance schema simplified to use only ZKP identification
- Authentication flow streamlined for email/password + ZKP
- UI messaging updated to reflect mandatory verification requirements

## Development Notes

### Database Schema Changes
- Removed all `walletAddress` fields and indexes
- Updated user schema to make `aadhaarZKP.nullifier` required
- Cleaned up legacy indexes causing duplicate key errors
- Simplified grievance identification to use ZKP nullifiers only

### Authentication Flow
1. User registers with email/password and profile information
2. System generates JWT token for basic access
3. User must complete Aadhaar ZKP verification to access full platform
4. ZKP nullifier prevents duplicate accounts and spam

### Verification Requirements
- All users must verify their Aadhaar using Zero-Knowledge Proof
- Verification includes age proof (18+), gender, state, and pincode
- Privacy-preserving: actual Aadhaar details never stored
- Spam prevention through cryptographic nullifiers

## Future Enhancements
- Email verification system
- Phone number verification via OTP
- Advanced analytics and reporting
- Multi-language support
- Mobile application
- Integration with government databases
- Advanced grievance categorization
- AI-powered grievance routing
