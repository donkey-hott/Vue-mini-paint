export type UserCredentials = {
  email: string;
  password: string;
};

export type PictureRecord = {
  date: string;
  imgURL: string;
  title: string;
};

export interface Pictures {
  [key: string]: PictureRecord;
}

export type OnboardingStep = {
  textContent: string;
  elementId: string;
  nextRoute: string;
};
