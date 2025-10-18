export interface ProfileData {
  username: string;
  bio: string;
  image?: string;
  following?: boolean;
  blocked?: boolean;
}

export interface ProfileRO {
  profile: ProfileData;
}
