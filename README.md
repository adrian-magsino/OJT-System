# OJT Portal

A comprehensive web-based platform connecting CvSU students to Host Training Establishments (HTEs) and assisting coordinators in managing OJT documentation.

## 🎯 Overview

The OJT Portal is designed to streamline the process of matching Computer Science students from Cavite State University with appropriate training establishments. The platform provides tools for browsing HTEs, generating recommendation letters, and managing the entire OJT workflow.

## ✨ Features

### 🏢 **Centralized HTE Directory**
- Browse and search Host Training Establishments
- View detailed company information and available work tasks
- Filter HTEs by specialization and requirements

### 🎯 **Personalized HTE Recommendations**
- Smart algorithm matching student skills to relevant work tasks
- Customized recommendations based on student specialization
- Streamlined application process

### ⏱️ **Time-Saving Process**
- Automated recommendation letter generation
- Reduced manual work for both students and coordinators
- Digital document management

### 📄 **Document Generation**
- Automated PDF generation for recommendation letters
- Professional formatting with university branding
- Batch processing for multiple students

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **PDF Generation**: Puppeteer
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ojt-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                          # Next.js 14 App Router
│   ├── (public)/                # Public pages (landing, about)
│   ├── api/                     # API routes
│   │   └── generate-rl/         # Recommendation letter generation
│   ├── coordinator/             # Coordinator dashboard
│   │   ├── hte/                 # HTE management
│   │   └── generate-rl/         # Document generation
│   └── layout.jsx               # Root layout
├── components/                   # Reusable UI components
│   └── layout/                  # Layout components
│       └── public/              # Public layout (Header, Footer)
├── contexts/                    # React contexts
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions and configurations
│   ├── actions/                 # Server actions
│   └── config/                  # Site configuration
└── middleware.js                # Next.js middleware
```

## 🔧 Key Components

### HTE Management
- **Create HTE**: [`CreateHTEClientComponent.jsx`](src/app/coordinator/hte/create/CreateHTEClientComponent.jsx)
- **View HTE**: [`ViewHTEClientComponent.jsx`](src/app/coordinator/hte/view/[id]/ViewHTEClientComponent.jsx)
- **HTE Actions**: [`hte-actions`](src/lib/actions/hte-actions)

### Document Generation
- **PDF Generation API**: [`generate-rl/route.js`](src/app/api/generate-rl/route.js)
- **Generation Interface**: [`GenerateRLClientComponent.jsx`](src/app/coordinator/generate-rl/GenerateRLClientComponent.jsx)

### Site Configuration
- **Site Config**: [`site.js`](src/lib/config/site.js)
- **External Links**: CvSU official links and social media

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 📄 Document Templates

The system generates professional recommendation letters with:
- CvSU official letterhead and branding
- Proper formatting for formal correspondence
- Dynamic content based on student and HTE data
- PDF output for easy sharing and printing

## 🔐 Authentication & Authorization

The platform uses Supabase authentication with role-based access:
- **Students**: Browse HTEs, view recommendations
- **Coordinators**: Manage HTEs, generate documents, oversee applications

## 👥 Developers

This project was developed by:

- **Adrian A. Magsino**
- **Jomel David P. Poquiz**

## 📧 Contact

**Cavite State University**  
College of Engineering and Information Technology  
Indang, Cavite, Philippines

For more information about CvSU:
- Website: [cvsu.edu.ph](https://cvsu.edu.ph/)
- Facebook: [CaviteStateU](https://www.facebook.com/CaviteStateU/)

**Developer's Contact Information**
*Emails:*
- Adrian A. Magsino: main.adrian.magsino@cvsu.edu.ph
- Jomel David P. Poquiz: main.jomeldavid.poquiz@cvsu.edu.ph


*Computer Science Students, Cavite State University*

## 📝 License

This project is developed for educational purposes as part of the Computer Science Practicum at Cavite State University.

---

*Built with ❤️ for CvSU Students*
