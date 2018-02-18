export interface ProfileData {
  username: string;
  email: string;
  bio: string;
  image?: string;
  following?: boolean;
}

export interface ProfileRO {
  profile: ProfileData;
}