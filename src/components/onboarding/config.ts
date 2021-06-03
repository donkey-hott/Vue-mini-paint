export const onboardingConfig = {
  steps: [
    {
      textContent:
        "Welcome to Mini-paint! Let me show you what you can do here!",
      element: document.querySelector("#logo"),
    },
    {
      textContent: "Here you can create new image",
      element: document.querySelector("#new-picture"),
      nextStepRoute: "/new-canvas",
    },
    {
      textContent: "Here is a panel with all possible tools",
      element: document.querySelector("#tools"),
    },
  ],
  versions: [
    {
      version: 1,
      newItemsNumber: 3,
    },
  ],
};
