export enum PostType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface CreatePostDTO {
  content: string;
  type: PostType;
  groupId?: string;
}
