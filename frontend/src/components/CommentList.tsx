import React, { useState, useEffect } from 'react';
import { Comment as CommentType } from '../types/Comment';
import { commentService } from '../services/api';
import Comment from './Comment';

const CommentList: React.FC = () => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await commentService.getComments();
            setComments(response.results);
        } catch (err) {
            setError('Failed to load comments');
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleCommentUpdate = () => {
        fetchComments();
    };

    const handleCommentDelete = (deletedId: number) => {
        setComments(prevComments => prevComments.filter(comment => comment.id !== deletedId));
    };

    const handleLikeUpdate = (commentId: number, newLikes: number, userAction: string) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, likes: newLikes }
                    : comment
            )
        );
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    // Determine which comments to display
    const displayedComments = showAll ? comments : comments.slice(0, 3);
    const hasMoreComments = comments.length > 3;

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-5">
                <div className="text-center py-10 text-gray-500">
                    <div className="text-base">Loading comments...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-5">
                <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="mb-3">{error}</p>
                    <button
                        onClick={fetchComments}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-6">
                <h2 className="m-0 text-gray-800 text-3xl font-bold">
                    Comments
                </h2>
            </div>

            {comments.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="m-0 text-base">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-0">
                        {displayedComments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onUpdate={handleCommentUpdate}
                                onDelete={() => handleCommentDelete(comment.id)}
                                onLikeUpdate={handleLikeUpdate}
                            />
                        ))}
                    </div>

                    {hasMoreComments && (
                        <div className="text-center mt-6">
                            <button
                                onClick={toggleShowAll}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {showAll ? `Show Less` : `Show All (${comments.length} comments)`}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentList;
