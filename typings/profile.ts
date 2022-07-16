export interface Profile {
  username: string;
  website: string;
}

export interface ProfileResponse {
  success: boolean;
  data?: Profile;
  error?: string;
}
