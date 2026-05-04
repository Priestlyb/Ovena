// stores/authStore.ts
import { create } from "zustand";

type AuthStore = {
  version: number;
  bumpVersion: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  version: 0,
  bumpVersion: () => set((state) => ({ version: state.version + 1 })),
}));