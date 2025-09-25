import React, { useState } from 'react';
import CommentList from './components/CommentList';
import AddComment from './components/AddComment';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 py-5">
      <div className="text-center mb-10 px-5">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src="/bobyard.png"
            alt="Bobyard Logo"
            className="h-16 w-auto object-contain drop-shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Comment System
          </h1>
        </div>
        <p className="text-white/90 text-lg font-light max-w-2xl mx-auto">
          Share your thoughts and join the conversation!
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5">
        <AddComment onCommentAdded={handleCommentAdded} />
        <CommentList key={refreshKey} />
      </div>
    </div>
  );
}

export default App;
