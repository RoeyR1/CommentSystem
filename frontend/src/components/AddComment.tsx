import React, { useState } from 'react';
import { commentService } from '../services/api';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

interface AddCommentProps {
    onCommentAdded: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({ onCommentAdded }) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await commentService.createComment({
                author: 'Admin',
                text: text.trim(),
                likes: 0,
                image: null
            });

            setText('');
            onCommentAdded();
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: getAvatarColor('Admin') }}
                    >
                        {getInitials('Admin')}
                    </div>
                    <h3 className="m-0 text-gray-800 text-xl font-semibold">
                        Add a Comment
                    </h3>
                </div>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Admin
                </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your comment here..."
                    className="w-full p-4 border-2 border-gray-200 rounded-lg font-inherit text-sm resize-y min-h-24 transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                    rows={4}
                    disabled={isSubmitting}
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-500 text-white rounded-lg text-sm font-semibold min-w-40 cursor-pointer transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        disabled={!text.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddComment;
