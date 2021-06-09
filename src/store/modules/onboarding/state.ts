import { OnboardingVersion } from "@/store/types";

export type State = {
  showOnboarding: boolean;
  displayedVersion: OnboardingVersion | null;
  versions: Array<OnboardingVersion>;
};

export const state: State = {
  showOnboarding: false,
  displayedVersion: null,
  versions: [
    {
      versionId: "1.0",
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
    },
    {
      versionId: "1.1",
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
        {
          textContent: "New function added: use pencil!",
          elementId: "pencil",
          nextRoute: "/new-canvas",
        },
      ],
    },
  ],
};
