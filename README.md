# Trello Clone – React + Vite + NestJS

A full-featured Trello Clone built with React, Vite, NestJS, and PostgreSQL. Supports real-time collaboration, drag and drop, comments, file attachments, Google OAuth, and more.

## Getting Started

1. Clone the repository

git clone https://github.com/tranvanhieu20032001/Trello-app.git
cd Trello-app

2. Set up environment variables

Create a `.env` file in the project root and add the following:

VITE_US_ACCESS_KEY=your_unsplash_access_key  
VITE_US_SECRET_KEY=your_unsplash_secret_key  
VITE_TINY_KEY=your_tiny_mce_api_key  
VITE_API_ENDPOINT=http://localhost:3002/api/v1  
VITE_BE_URL=http://localhost:3002

3. Install dependencies

npm install

4. Start the development server

npm run dev

## Authentication Features

- Register and login with email and password  
- Google OAuth integration  
- Secure session management using HTTP-only cookies and JWT

## Core Features

Board Management: Create, update, and delete boards. Share boards with other users. Trello-style board interface.

Column and Card System: Create, rename, and delete columns and cards. Drag and drop cards between columns, including empty columns.

Real-Time Collaboration: WebSocket support for live updates. All changes made by any user are reflected in real-time to all collaborators.

Card Details and Modal: Click on a card to view and edit its details in a modal. Modify title, description, due date, and manage attachments.

Label and Tag System: Create customizable labels with colors. Assign, edit, and remove labels on cards. Intuitive interface for managing tags.

Comment System: Add, edit, and delete comments using a rich-text editor powered by TinyMCE.

File Attachments: Upload and attach files directly or from Google Drive. View all attached files in the card detail modal.

User Interface: Fully responsive layout for both desktop and mobile. Smooth drag-and-drop experience using DnD Kit. Clean and intuitive design.

Role and Permissions: Each board supports Admin and User roles. Only Admins can invite members, delete the board, or perform global edits.

