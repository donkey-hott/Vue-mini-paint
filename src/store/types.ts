export type UserCredentials = {
  email: string;
  password: string;
};

export type UserProfile = {
  fullname: string | null;
  birthDate: string | null;
  gender: string | null;
  bio: string | null;
  avatar: File | undefined | null;
  company: string | null;
  post: string | null;
  linkedInURL: string | null;
  email: string | null;
  phone: string | null;
};

export type PictureRecord = {
  date: string;
  imgURL: string;
  title: string;
};

export interface Pictures {
  [key: string]: PictureRecord;
}
