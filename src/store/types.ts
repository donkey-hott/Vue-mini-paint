export type UserCredentials = {
  email: string;
  password: string;
};

export type UserProfile = {
  fullname?: string;
  birthDate?: string;
  gender?: string;
  bio?: string;
  avatar?: File | undefined;
  company?: string;
  post?: string;
  linkedInURL?: string;
  email: string;
  phone?: string;
};

export type PictureRecord = {
  date: string;
  imgURL: string;
  title: string;
};

export interface Pictures {
  [key: string]: PictureRecord;
}
