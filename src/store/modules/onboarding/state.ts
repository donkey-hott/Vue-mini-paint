import { OnboardingStep } from "@/store/types";

export type State = {
  showOnboarding: boolean;
  config: OnboardingStep[];
};

export const state: State = {
  showOnboarding: false,
  config: [
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
    // {
    //   textContent: "More shapes",
    //   elementId: "moreShapes",
    //   nextRoute: "/new-canvas",
    // },
  ],
};
