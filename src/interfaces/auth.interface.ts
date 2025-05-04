export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPreference {
  userId: number;
  notificationEnabled?: boolean;
  theme?: string;
  preferredCategories?: string[];
  updatedAt?: Date;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCredentials extends ILoginCredentials {
  username: string;
}

export interface ITokenPayload {
  id: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: IUser;
    token: string;
  };
  error?: string;
}
