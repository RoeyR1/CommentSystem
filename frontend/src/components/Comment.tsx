import React, { useState } from 'react';
import { Comment as CommentType } from '../types/Comment';
import { commentService } from '../services/api';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

interface CommentProps {
    comment: CommentType;
    onUpdate: () => void;
    onDelete: () => void;
    onLikeUpdate: (commentId: number, newLikes: number, userAction: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onUpdate, onDelete, onLikeUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const [isLoading, setIsLoading] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [userAction, setUserAction] = useState<'like' | 'dislike' | 'neutral'>('neutral');

    const handleEdit = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await commentService.updateComment(comment.id, { text: editedText });
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (isLoading) return;

        if (window.confirm('Are you sure you want to delete this comment?')) {
            setIsLoading(true);
            try {
                await commentService.deleteComment(comment.id);
                onDelete();
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleToggleLike = async (action: 'like' | 'dislike') => {
        if (isLiking) return;

        // Store the current action as previous action
        const previousAction = userAction;

        // Determine the new action based on current state
        let newAction: 'like' | 'dislike' | 'neutral';

        if (userAction === action) {
            // If clicking the same button, toggle off (neutral)
            newAction = 'neutral';
        } else {
            // If clicking different button, switch to that action
            newAction = action;
        }

        setIsLiking(true);
        try {
            const response = await commentService.toggleLike(comment.id, newAction, previousAction);
            setUserAction(newAction);
            onLikeUpdate(comment.id, response.likes, newAction);
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Failed to update like status');
        } finally {
            setIsLiking(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-xl p-5 mb-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    {comment.image ? (
                        <img
                            src={comment.image}
                            alt={comment.author}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                // Fallback to initials avatar if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div className={`w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-white font-semibold text-sm ${comment.image ? 'hidden' : ''}`}
                        style={{ backgroundColor: getAvatarColor(comment.author) }}>
                        {getInitials(comment.author)}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-base font-semibold text-gray-800 m-0">
                            {comment.author}
                        </h4>
                        <span className="text-xs text-gray-500 mt-0.5">
                            {formatDate(comment.date)}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            <div className="mb-3">
                {isEditing ? (
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg font-inherit text-sm resize-y min-h-20 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isLoading || !editedText.trim()}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="m-0 leading-relaxed text-gray-700 text-sm">
                        {comment.text}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleToggleLike('like')}
                        disabled={isLiking}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${userAction === 'like'
                            ? 'text-green-700 bg-green-100 border border-green-200'
                            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}
                    >
                        <span className="text-sm">👍</span>
                        <span>{isLiking ? '...' : 'Like'}</span>
                    </button>
                    <button
                        onClick={() => handleToggleLike('dislike')}
                        disabled={isLiking}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${userAction === 'dislike'
                            ? 'text-red-700 bg-red-100 border border-red-200'
                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                            }`}
                    >
                        <span className="text-sm">👎</span>
                        <span>{isLiking ? '...' : 'Dislike'}</span>
                    </button>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                    ❤️ {Math.max(0, comment.likes)} likes
                </span>
            </div>
        </div>
    );
};

export default Comment;
