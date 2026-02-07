// stores/completionStore.ts - Zustand store for completion tracking (NO PERSISTENCE)
import { create } from 'zustand';

interface CompletionStatus {
  verifyBusiness: boolean;
  completeProfile: boolean;
  setupPayments: boolean;
  setupOperations: boolean;
  addMenuItems: boolean;
}

interface CompletionStore {
  completionStatus: CompletionStatus;
  markGroupComplete: (group: keyof CompletionStatus) => void;
  resetCompletion: () => void;
  getIsAllComplete: () => boolean;
}

const initialStatus: CompletionStatus = {
  verifyBusiness: false,
  completeProfile: false,
  setupPayments: false,
  setupOperations: false,
  addMenuItems: false,
};

export const useCompletionStore = create<CompletionStore>()((set, get) => ({
  completionStatus: initialStatus,
  
  markGroupComplete: (group: keyof CompletionStatus) => {
    console.log(`[CompletionStore] Marking ${group} as complete`);
    set((state) => {
      const newStatus = {
        ...state.completionStatus,
        [group]: true,
      };
      console.log('[CompletionStore] New completion status:', newStatus);
      
      // Check if all complete
      const allComplete = Object.values(newStatus).every(status => status === true);
      console.log('[CompletionStore] All complete?', allComplete);
      
      return { completionStatus: newStatus };
    });
  },

  resetCompletion: () => {
    console.log('[CompletionStore] Resetting all completion status');
    set({ completionStatus: initialStatus });
  },

  getIsAllComplete: () => {
    const status = get().completionStatus;
    const allComplete = Object.values(status).every(s => s === true);
    console.log('[CompletionStore] Checking if all complete:', allComplete, status);
    return allComplete;
  },
}));

// Custom hook to get isAllComplete as a reactive value
export const useIsAllComplete = () => {
  const completionStatus = useCompletionStore((state) => state.completionStatus);
  const isAllComplete = Object.values(completionStatus).every(status => status === true);
  
  console.log('[useIsAllComplete] Status:', completionStatus);
  console.log('[useIsAllComplete] All complete:', isAllComplete);
  
  return isAllComplete;
};