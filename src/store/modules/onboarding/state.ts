import { OnboardingStep } from "@/store/types";

export type State = {
  showOnboarding: boolean;
  config: OnboardingStep[];
};

export const state: State = {
  showOnboarding: false,
  config: [
    {
      textContent: "Welcome aboard!",
      elementId: "logo",
      nextRoute: "/",
    },
    {
      textContent: "Create new picture",
      elementId: "new-picture",
      nextRoute: "/",
    },
    {
      textContent: "Tools panel",
      elementId: "tools",
      nextRoute: "/new-canvas",
    },
    {
      textContent: "More shapes",
      elementId: "moreShapes",
      nextRoute: "/new-canvas",
    },
  ],
};
