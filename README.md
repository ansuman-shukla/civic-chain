# CivicChain

A modern React-based civic governance platform with mandatory Aadhaar Zero-Knowledge Proof verification for transparent grievance management and government accountability.

## 🚀 Features

- **Email/Password Authentication** - Secure JWT-based user authentication
- **Mandatory Aadhaar ZKP Verification** - Zero-knowledge proof verification for all users
- **Unified Navigation** - Consistent navigation across all platform pages
- **National Public Leaderboard** - Transparent state-wise grievance performance metrics
- **State-Specific Dashboards** - Detailed performance analytics per state
- **Comprehensive Admin Dashboard** - Real-time analytics and grievance management
- **Citizen Dashboard** - Easy grievance filing and tracking system
- **Mobile-Responsive Design** - TailwindCSS with extensive customization
- **Real-time Analytics** - D3.js and Recharts for powerful data visualization
- **Form Management** - Robust form handling with validation
- **Privacy-Preserving** - ZKP ensures user privacy while preventing spam

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with 7-day expiry
- **Password Hashing** - bcryptjs with salt rounds for secure password storage
- **Zero-Knowledge Proof** - Anon Aadhaar v2.4.3 for privacy-preserving verification
- **Nullifier-based Prevention** - Cryptographic nullifiers prevent duplicate accounts
- **Input Validation** - Comprehensive validation and sanitization
- **Secure API Endpoints** - Authentication middleware on all protected routes

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- GitHub CLI (for repository management)
- npm or yarn

## 🛠️ Installation

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
   
2. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/civicchain
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3001
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

## 🏗️ Tech Stack

### Frontend
- **React 18.2.0** - Modern React with concurrent features
- **Vite 5.0.0** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Declarative routing for SPA navigation

### Backend
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **JWT** - JSON Web Tokens for secure authentication
- **bcryptjs** - Password hashing and salt generation

### Zero-Knowledge Proof
- **Anon Aadhaar v2.4.3** - Privacy-preserving Aadhaar verification
- **Cryptographic Nullifiers** - Prevent duplicate accounts
- **ZKP Circuits** - Age, gender, state, and pincode verification

## 📁 Project Structure

```
civic-chain/
├── public/                 # Static assets and manifest
├── backend/               # Express.js API server
│   ├── server.js         # Main server file with auth and ZKP endpoints
│   └── package.json      # Backend dependencies
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── auth/        # Aadhaar ZKP authentication components
│   │   └── ui/          # Common UI components (Button, Input, etc.)
│   ├── pages/           # Page components
│   │   ├── citizen-authentication/     # Email/password registration
│   │   ├── citizen-dashboard-grievance-filing/  # Citizen grievance interface
│   │   ├── national-public-leaderboard/         # National transparency portal
│   │   ├── state-specific-performance-dashboard/ # State-wise analytics
│   │   └── comprehensive-admin-dashboard/       # Admin management interface
│   ├── contexts/        # React contexts (AuthContext)
│   ├── styles/          # Global styles and Tailwind configuration
│   ├── utils/           # Utility functions and helpers
│   ├── App.jsx          # Main application component with routing
│   ├── Routes.jsx       # Application routes configuration
│   └── index.jsx        # Application entry point
├── scripts/             # Database population and setup scripts
├── CHANGELOG.md         # Detailed version history and changes
├── .gitignore          # Git ignore rules
├── package.json        # Frontend dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.mjs     # Vite configuration
```

## 🔐 Authentication Flow

1. **User Registration**: Email/password with comprehensive profile collection
2. **JWT Token Generation**: 7-day expiry tokens for session management
3. **Aadhaar ZKP Verification**: Mandatory zero-knowledge proof verification
4. **Nullifier Generation**: Cryptographic prevention of duplicate accounts
5. **Full Platform Access**: Complete access after successful ZKP verification

## 🎯 Key Pages

### Citizen Interface
- **Authentication**: `/citizen-authentication` - Registration and login
- **Dashboard**: `/citizen-dashboard-grievance-filing` - File and track grievances
- **ZKP Verification**: `/citizen-zkp-authentication` - Aadhaar verification

### Public Transparency
- **National Leaderboard**: `/national-public-leaderboard` - State performance rankings
- **State Dashboard**: `/state-specific-performance-dashboard` - State-specific analytics

### Admin Interface
- **Admin Portal**: `/admin-authentication-portal` - Admin login
- **Admin Dashboard**: `/comprehensive-admin-dashboard` - Complete grievance management

## 🧩 Adding New Features

To add new routes, update `src/Routes.jsx`:

```jsx
import { useRoutes } from "react-router-dom";
import NewPage from "pages/NewPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    // ...existing routes...
    { path: "/new-feature", element: <NewPage /> },
  ]);

  return element;
};
```

## 🎨 Styling & Design

This project uses **TailwindCSS** for comprehensive styling with:

- **Responsive Design** - Mobile-first approach with breakpoint utilities
- **Custom Theme** - Consistent color palette and typography
- **Component Library** - Reusable UI components (Button, Input, Select, etc.)
- **Form Styling** - Enhanced form controls with validation states
- **Animation Utilities** - Smooth transitions and micro-interactions
- **Dark Mode Ready** - Prepared for theme switching

## 📱 Responsive Breakpoints

- **Mobile**: `sm:` (640px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large Desktop**: `xl:` (1280px+)

## 🚦 Development Workflow

### Local Development
```bash
# Start both frontend and backend
npm run dev          # Frontend (port 4028)
cd backend && node server.js  # Backend (port 3001)
```

### Code Quality
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Git Hooks** - Pre-commit validation

## � Deployment

### Frontend Deployment
```bash
npm run build        # Create production build
# Deploy /dist folder to your hosting service
```

### Backend Deployment
```bash
# Set environment variables
export MONGODB_URI="your-production-mongodb-uri"
export JWT_SECRET="your-production-jwt-secret"
export PORT=3001

# Start production server
node backend/server.js
```

## � Links

- **Repository**: [https://github.com/BishalJena/civic-chain](https://github.com/BishalJena/civic-chain)
- **Live Demo**: Coming soon
- **Documentation**: See [CHANGELOG.md](CHANGELOG.md) for detailed version history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Anon Aadhaar** - Privacy-preserving Aadhaar verification
- **React Team** - Amazing frontend framework
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **MongoDB** - Flexible document database

## 🚨 Important Notes

- **Aadhaar ZKP verification is mandatory** for all users
- **No wallet functionality** - completely removed
- **Privacy-preserving** - Actual Aadhaar details never stored
- **Spam prevention** - Cryptographic nullifiers prevent fake accounts

Built with ❤️ for transparent civic governance and government accountability.
