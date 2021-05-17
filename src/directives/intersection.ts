import { DirectiveBinding } from "vue";

export const intersection = {
  mounted(target: HTMLElement, binding: DirectiveBinding<any>): void {
    if (!target) return;
    const { handler, options } = binding.value;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => handler(entry));
    }, options);

    observer.observe(target);
  },
};
