import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================= STORAGE KEY ================= */
const STORAGE_KEY = "PHASE2_DATA";

/* ================= TYPES ================= */
interface OperatingHour {
  day: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface Branch {
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;

  delivery_method?: string | null;

  pre_order_open_period?: string | null;
  final_order_time?: string | null;

  operating_hours?: OperatingHour[];
}

interface Payment {
  bank: string;
  account_number: string;
  account_name: string;
  bvn: string;
}

interface BusinessDocuments {
  registered_business_name: string;
  business_type: string;
  tax_identification_number: string;
  rc_number: string;
  document_image: string;
}

interface Phase2Data {
  branches: Branch[];
  payment: Payment;
  business_documents: BusinessDocuments;
}

interface Phase2ContextType {
  phase2Data: Phase2Data;
  isHydrated: boolean;
  updatePhase2: (data: Partial<Phase2Data>) => void;
  updateBranches: (branches: Branch[]) => void;
  updatePayment: (payment: Partial<Payment>) => void;
  updateBusinessDocuments: (docs: Partial<BusinessDocuments>) => void;
  resetPhase2: () => void;
}

/* ================= CONTEXT ================= */
export const Phase2Context = createContext<Phase2ContextType | null>(null);

/* ================= HELPERS ================= */
const clean = (val: any) => {
  if (val === null || val === undefined) return "";
  return String(val).trim();
};

const cleanOrNull = (val: any) => {
  const v = clean(val);
  return v === "" ? null : v;
};

/* ================= DEFAULT STATE ================= */
const defaultState: Phase2Data = {
  branches: [],
  payment: { bank: "", account_number: "", account_name: "", bvn: "" },
  business_documents: {
    registered_business_name: "",
    business_type: "",
    tax_identification_number: "",
    rc_number: "",
    document_image: "",
  },
};

/* ================= PROVIDER ================= */
export const Phase2Provider = ({ children }: { children: ReactNode }) => {
  const [phase2Data, setPhase2Data] = useState<Phase2Data>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  /* ================= HYDRATE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPhase2Data(parsed);
        }
      } catch (err) {
        console.error("Failed to load Phase2 data:", err);
      } finally {
        setIsHydrated(true);
      }
    };

    loadData();
  }, []);

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    if (!isHydrated) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(phase2Data));
      } catch (err) {
        console.error("Failed to save Phase2 data:", err);
      }
    };

    saveData();
  }, [phase2Data, isHydrated]);

  /* ================= NORMALIZERS ================= */
  const normalizeBranch = (b: Branch): Branch => {
    const deliveryMethod = cleanOrNull(b.delivery_method);
    const isScheduled = deliveryMethod === "scheduled";

    return {
      name: clean(b.name),
      address: clean(b.address),

      latitude:
        Array.isArray(b.latitude) && b.latitude.length > 0
          ? Number(b.latitude[0])
          : b.latitude != null
            ? Number(b.latitude)
            : null,

      longitude:
        Array.isArray(b.longitude) && b.longitude.length > 0
          ? Number(b.longitude[0])
          : b.longitude != null
            ? Number(b.longitude)
            : null,

      delivery_method: deliveryMethod,

      pre_order_open_period: isScheduled
        ? cleanOrNull(b.pre_order_open_period)
        : null,

      final_order_time: isScheduled ? cleanOrNull(b.final_order_time) : null,

      operating_hours: !isScheduled
        ? (b.operating_hours || []).map((h) => ({
            day: Number(h.day ?? 0),
            open_time: clean(h.open_time),
            close_time: clean(h.close_time),
            is_closed: Boolean(h.is_closed ?? false),
          }))
        : [],
    };
  };

  const normalizePayment = (p: Partial<Payment>): Payment => ({
    bank: clean(p.bank),
    account_number: clean(p.account_number),
    account_name: clean(p.account_name),
    bvn: clean(p.bvn),
  });

  const normalizeBusinessDocs = (
    d: Partial<BusinessDocuments>,
  ): BusinessDocuments => ({
    registered_business_name: clean(d.registered_business_name),
    business_type: clean(d.business_type),
    tax_identification_number: clean(d.tax_identification_number),
    rc_number: clean(d.rc_number),
    document_image: clean(d.document_image),
  });

  /* ================= UPDATERS ================= */
  const updatePhase2 = (data: Partial<Phase2Data>) => {
    setPhase2Data((prev) => ({
      ...prev,

      branches: data.branches
        ? data.branches.map((b) => normalizeBranch(b))
        : prev.branches,

      payment: data.payment
        ? normalizePayment({ ...prev.payment, ...data.payment })
        : prev.payment,

      business_documents: data.business_documents
        ? normalizeBusinessDocs({
            ...prev.business_documents,
            ...data.business_documents,
          })
        : prev.business_documents,
    }));
  };

  const updateBranches = (branches: Branch[]) => {
    setPhase2Data((prev) => ({
      ...prev,
      branches: branches.map((b) => normalizeBranch(b)),
    }));
  };

  const updatePayment = (payment: Partial<Payment>) => {
    setPhase2Data((prev) => ({
      ...prev,
      payment: normalizePayment({ ...prev.payment, ...payment }),
    }));
  };

  const updateBusinessDocuments = (docs: Partial<BusinessDocuments>) => {
    setPhase2Data((prev) => ({
      ...prev,
      business_documents: normalizeBusinessDocs({
        ...prev.business_documents,
        ...docs,
      }),
    }));
  };

  const resetPhase2 = async () => {
    setPhase2Data(defaultState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Phase2Context.Provider
      value={{
        phase2Data,
        isHydrated,
        updatePhase2,
        updateBranches,
        updatePayment,
        updateBusinessDocuments,
        resetPhase2,
      }}
    >
      {children}
    </Phase2Context.Provider>
  );
};

/* ================= HOOK ================= */
export const usePhase2 = () => {
  const context = useContext(Phase2Context);
  if (!context) {
    throw new Error("usePhase2 must be used within a Phase2Provider");
  }
  return context;
};
