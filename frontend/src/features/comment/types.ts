export interface Comment {
  id: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export interface CommentPage {
  content: Comment[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

