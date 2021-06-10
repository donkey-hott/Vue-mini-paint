import { isValidPhoneNumber } from "libphonenumber-js";

export const isValidTel = (value: string): boolean => {
  return isValidPhoneNumber(value);
};

export const isValidLinkedInURL = (value: string): boolean => {
  if (value.length === 0) return true;

  const LINKEDIN_PROFILE_URL_REGEX = /(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/gm;
  return LINKEDIN_PROFILE_URL_REGEX.test(value);
};

/* 'isAdult' accepts date string in format of input[type="date"] */
export const isAdult = (value: string): boolean => {
  const LEGAL_AGE = 18;
  const millisecondsPassed = Date.now() - new Date(value).getTime();

  return (
    Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24 * 365.25)) >= LEGAL_AGE
  );
};
