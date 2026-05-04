import { create } from "zustand";

type OnboardingState = {
  step: number;
  completed: boolean;
  setOnboarding: (step: number) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  completed: false,

  setOnboarding: (step) =>
    set({
      step,
      completed: step >= 3,
    }),

  reset: () =>
    set({
      step: 1,
      completed: false,
    }),
}));