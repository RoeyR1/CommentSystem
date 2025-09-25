export interface Comment {
    id: number;
    author: string;
    text: string;
    date: string;
    likes: number;
    image: string | null;
}

export interface CommentResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
}
