export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  role: string;
}
