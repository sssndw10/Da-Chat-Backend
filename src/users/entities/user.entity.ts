export interface User {
  userId: number;
  username: string;
  password: string;
  accessToken: string | null;
  refreshToken: string | null;
}
