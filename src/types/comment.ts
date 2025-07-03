export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  reactions?: Record<string, number>;
}
