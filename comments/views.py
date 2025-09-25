from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Comment
from .serializers import CommentSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

@api_view(['POST'])
def toggle_like(request, comment_id):
    """Toggle like/dislike state for a comment"""
    comment = get_object_or_404(Comment, id=comment_id)
    
    # Get the current action and previous action from request data
    action = request.data.get('action', 'like')  # 'like', 'dislike', or 'neutral'
    previous_action = request.data.get('previous_action', 'neutral')  # Previous state
    
    if action == 'like':
        if previous_action == 'dislike':
            # Was disliked, now liking: +2 (remove dislike + add like)
            comment.likes += 2
        elif previous_action == 'neutral':
            # Was neutral, now liking: +1
            comment.likes += 1
        # If previous_action was 'like', this is a toggle off, handled below
    
    elif action == 'dislike':
        if previous_action == 'like':
            # Was liked, now disliking: -2 (remove like + add dislike)
            comment.likes -= 2
        elif previous_action == 'neutral':
            # Was neutral, now disliking: -1
            comment.likes -= 1
        # If previous_action was 'dislike', this is a toggle off, handled below
    
    elif action == 'neutral':
        # Toggle off case - reverse the previous action
        if previous_action == 'like':
            # Was liked, now neutral: -1
            comment.likes -= 1
        elif previous_action == 'dislike':
            # Was disliked, now neutral: +1
            comment.likes += 1
    
    comment.save()
    serializer = CommentSerializer(comment)
    return Response({
        'comment': serializer.data,
        'user_action': action,
        'likes': comment.likes
    })
