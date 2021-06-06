import { OnboardingStep } from "@/store/types";

export type State = {
  config: OnboardingStep[];
};

export const state: State = {
  config: [
    {
      textContent: "Welcome aboard!",
      elementId: "logo",
      nextRoute: "/",
    },
    {
      textContent: "Create new picture",
      elementId: "new-picture",
      nextRoute: "/new-canvas",
    },
    {
      textContent: "Tools panel",
      elementId: "tools",
      nextRoute: null,
    },
  ],
};
