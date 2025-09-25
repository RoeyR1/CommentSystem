import axios from 'axios';
import { Comment, CommentResponse } from '../types/Comment';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const commentService = {
    // Get all comments
    getComments: async (): Promise<CommentResponse> => {
        const response = await api.get<CommentResponse>('/comments/');
        return response.data;
    },

    // Get a single comment by ID
    getComment: async (id: number): Promise<Comment> => {
        const response = await api.get<Comment>(`/comments/${id}/`);
        return response.data;
    },

    // Create a new comment
    createComment: async (comment: Omit<Comment, 'id' | 'date'>): Promise<Comment> => {
        const response = await api.post<Comment>('/comments/', comment);
        return response.data;
    },

    // Update an existing comment
    updateComment: async (id: number, comment: Partial<Comment>): Promise<Comment> => {
        const response = await api.patch<Comment>(`/comments/${id}/`, comment);
        return response.data;
    },

    // Delete a comment
    deleteComment: async (id: number): Promise<void> => {
        await api.delete(`/comments/${id}/`);
    },

    // Toggle like/dislike for a comment
    toggleLike: async (id: number, action: 'like' | 'dislike' | 'neutral', previousAction: 'like' | 'dislike' | 'neutral'): Promise<{ comment: Comment, user_action: string, likes: number }> => {
        const response = await api.post(`/comments/${id}/toggle-like/`, { action, previous_action: previousAction });
        return response.data;
    },
};

export default api;
