from django.urls import path
from .views import CommentListCreateView, CommentRetrieveUpdateDestroyView, toggle_like

urlpatterns = [
    path('', CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-detail'),
    path('<int:comment_id>/toggle-like/', toggle_like, name='comment-toggle-like'),
]
