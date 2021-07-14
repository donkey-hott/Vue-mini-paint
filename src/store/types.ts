export type UserCredentials = {
  email: string;
  password: string;
};

export type UserProfile = {
  fullname?: string;
  birthDate?: string;
  gender?: string;
  bio?: string;
  avatar?: string | null;
  company?: string;
  post?: string;
  linkedInURL?: string;
  email: string;
  phone?: string;
  role: string;
  plan: {
    type: string;
    price: number;
  };
};

export type PictureRecord = {
  date: string;
  imgURL: string;
  title: string;
};

export interface Pictures {
  [key: string]: PictureRecord;
}

export enum UserPlanTypes {
  DEFAULT_PLAN = "default",
  PREMIUM_PLAN = "premium",
}
