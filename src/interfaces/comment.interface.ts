export interface IComment {
  id?: number;
  content: string;
  userId: number;
  newsId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReaction {
  id?: number;
  userId: number;
  newsId: number;
  type: ReactionType;
  createdAt?: Date;
}

export enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
  ANGRY = "angry",
  HAPPY = "happy",
  SAD = "sad",
  SURPRISED = "surprised",
}

export interface ICommentQueryParams {
  newsId?: number;
  userId?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface IReactionQueryParams {
  newsId?: number;
  userId?: number;
  type?: ReactionType;
}

export interface ICommentResponse {
  success: boolean;
  message?: string;
  data?: IComment | IComment[];
  count?: number;
  error?: string;
}

export interface IReactionResponse {
  success: boolean;
  message?: string;
  data?: IReaction | IReaction[];
  count?: number;
  error?: string;
}
