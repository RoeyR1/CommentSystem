from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
import json
import os
from comments.models import Comment

class Command(BaseCommand):
    help = 'Load comments from JSON file into the database'

    def handle(self, *args, **options):
        # Clear existing comments
        Comment.objects.all().delete()
        
        # Load comments from JSON file
        json_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'comments.json')
        
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        comments_created = 0
        for comment_data in data['comments']:
            Comment.objects.create(
                author=comment_data['author'],
                text=comment_data['text'],
                date=parse_datetime(comment_data['date']),
                likes=comment_data['likes'],
                image=comment_data['image'] if comment_data['image'] else None
            )
            comments_created += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully loaded {comments_created} comments')
        )
