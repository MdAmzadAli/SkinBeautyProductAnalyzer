# SkinSense - AI Skincare Ingredient Analyzer

## Overview

SkinSense is a React-based web application that provides AI-powered skincare ingredient analysis. The app allows users to create detailed skin profiles, upload photos of product ingredient lists, and receive personalized safety recommendations for each ingredient. Built with a modern tech stack including React, TypeScript, Tailwind CSS, and integrates with Google AI (Gemini) for intelligent analysis and OCR capabilities.

The application follows a multi-step user journey: profile creation → ingredient photo upload → OCR text extraction → AI analysis → personalized results with safety ratings and explanations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development experience
- **Styling**: Tailwind CSS with custom design system based on sage green color palette for skincare/health theme
- **Component Library**: Custom components built on Radix UI primitives for accessibility and consistency
- **State Management**: React hooks for local state, TanStack Query for server state and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules for consistency across frontend/backend
- **Architecture Pattern**: RESTful API design with clear separation of concerns
- **Storage Layer**: Abstracted storage interface (currently in-memory implementation, designed for easy database migration)
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage Solutions
- **Current Implementation**: In-memory storage with Map-based data structures for development
- **Production Ready**: Database schema defined using Drizzle ORM with PostgreSQL support
- **Data Models**: User profiles with skin type, concerns, allergies, lifestyle factors, and ingredient analysis history

### Authentication and Authorization
- **Current State**: Placeholder user system (demo-user for development)
- **Architecture**: Session-based authentication pattern prepared for implementation
- **Database Integration**: User schema defined with proper relationships and constraints

### Multi-Step Form System
- **Pattern**: Progressive disclosure with 5-step form collecting comprehensive skin data
- **Validation**: Form validation using React Hook Form with Zod schemas
- **UX Design**: Progress indicators, back/forward navigation, and step-by-step data collection
- **Data Structure**: Structured collection of skin type, concerns, allergies, lifestyle factors, and free-form additional information

### Image Processing Pipeline
- **Upload Handling**: File upload with drag-and-drop interface and image preview
- **OCR Integration**: Google ML Kit or equivalent for ingredient text extraction from photos
- **User Verification**: Extracted text review and confirmation step before analysis
- **Image Storage**: Prepared for cloud storage integration for uploaded product images

### AI Analysis System
- **AI Provider**: Google Gemini AI for ingredient analysis and recommendations
- **Analysis Process**: Combines user skin profile data with extracted ingredient lists
- **Safety Classification**: Four-tier rating system (Excellent, Good, Not Bad, Bad)
- **Personalization**: Analysis considers individual skin type, concerns, and sensitivities
- **Source Attribution**: Citations and credibility links from curated skincare research sources

### Search and Research Integration
- **Custom Search**: Google Programmable Search Engine configured for Indian skincare ingredient databases
- **Data Aggregation**: Compilation of relevant research snippets and safety information
- **Source Curation**: Focus on credible dermatological and skincare science sources
- **Context Awareness**: Search queries crafted for regional skincare concerns and ingredients

## External Dependencies

### Core Dependencies
- **@google/genai**: Google Gemini AI integration for ingredient analysis and safety recommendations
- **@neondatabase/serverless**: PostgreSQL database connectivity through Neon's serverless platform
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect for schema management and queries
- **@tanstack/react-query**: Server state management, caching, and synchronization for API calls

### UI Component Libraries  
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, forms, navigation, etc.)
- **class-variance-authority**: Type-safe CSS class composition for component variants
- **tailwindcss**: Utility-first CSS framework with custom design system configuration

### Form and Validation
- **react-hook-form**: Performant form library with validation integration
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript schema validation for forms and API data

### Development Tools
- **vite**: Fast build tool with React plugin and development server
- **typescript**: Static type checking across the entire application
- **drizzle-kit**: Database migration and schema management tools

### Planned Integrations
- **Google Custom Search JSON API**: For ingredient research and safety data aggregation
- **Google ML Kit OCR**: For extracting text from ingredient label photos
- **Cloud Storage Service**: For uploaded product images and analysis history
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple