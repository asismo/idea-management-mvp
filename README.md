# 💡 Ideas - AI-Powered Idea Management App

An intelligent web application that captures, organizes, and helps you discover your ideas using artificial intelligence. Record ideas via text or voice, and let AI automatically categorize them, generate tags, and create dynamic folder descriptions.

## ✨ Features

### Core Features
- **Text & Voice Capture**: Record ideas as text or voice (with optional API integration)
- **Automatic Categorization**: AI automatically assigns ideas to folders (Simple or Advanced mode)
- **Smart Tagging**: Automatically generates 2-5 relevant tags for each idea
- **Adaptive Descriptions**: AI-generated folder descriptions that update as you add ideas
- **Intelligent Search**: Find ideas by keywords, tags, or natural language questions
- **Folder Merging**: Visually merge folders; descriptions update automatically
- **Dark/Light Mode**: Full support for both themes
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

1. Install dependencies: `npm install`
2. Create `.env.local` with your Supabase and Gemini API keys
3. Set up Supabase database (see README for SQL)
4. Run dev server: `npm run dev`

## 🏗️ Tech Stack

- React 19 + TypeScript + Tailwind CSS 4
- Zustand for state management
- Supabase (PostgreSQL) for database
- Google Gemini API for AI features
- Vite for build tooling

## 📖 Full Documentation

See README.md for complete setup instructions, API key configuration, and usage guide.
