# Comment System

A full-stack web application built with Django REST Framework and React.js that provides a YouTube/Reddit-style comment system with full CRUD functionality and like/dislikes.

## 🚀 Features

- **View Comments**: Displays all comments with author, text, date, likes, and profile images
- **Add Comments**: Add new comments as "Admin" user with current timestamp
- **Edit Comments**: Click "Edit" button to modify comment text inline
- **Delete Comments**: Click "Delete" button with confirmation dialog
- **Like/Dislike Toggle**: Click 👍 or 👎 buttons to toggle like/dislike states
- **Avatar System**: Default avatar generation for users without profile pictures
- **Real-time Updates**: UI updates immediately after any operation

## 🛠️ Built With

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend
- **Framework**: Django REST Framework
- **Database**: PostgreSQL

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RoeyR1/CommentSystem.git
cd CommentSystem
```

### 2. Backend Setup

#### Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Python dependencies:
```bash
pip install -r requirements.txt
```

#### Set up PostgreSQL database:
```bash
createdb comments_db
createuser -s postgres
```

#### Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Load sample data:
```bash
python manage.py load_comments
```

#### Start the Django server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/comments/`

### 3. Frontend Setup

#### Navigate to frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`
