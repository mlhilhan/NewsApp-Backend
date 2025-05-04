export interface INews {
  id?: number;
  title: string;
  content: string;
  imageUrl?: string;
  source?: string;
  author?: string;
  category?: string;
  publishedAt?: Date;
  externalId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
}

export interface INewsCategory {
  newsId: number;
  categoryId: number;
}

export interface INewsQueryParams {
  category?: string;
  author?: string;
  source?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface INewsApiResponse {
  status: string;
  totalResults?: number;
  articles?: IExternalNewsArticle[];
  error?: string;
}

export interface IExternalNewsArticle {
  source?: {
    id?: string;
    name?: string;
  };
  author?: string;
  title: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
}
