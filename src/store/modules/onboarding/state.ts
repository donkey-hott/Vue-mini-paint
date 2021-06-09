import { OnboardingStep } from "@/store/types";

export type State = {
  showOnboarding: boolean;
  steps: OnboardingStep[];
};

export const state: State = {
  showOnboarding: false,
  steps: [
    {
      textContent: "Welcome! Let me show you what you can do with me",
      elementId: "logo",
      nextRoute: "/",
    },
    {
      textContent: "Start creating your fantastic pictures",
      elementId: "new-picture",
      nextRoute: "/",
    },
    {
      textContent: "Use tools",
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
