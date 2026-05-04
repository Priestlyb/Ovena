// app/superForm2.tsx - Router-based navigation
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function SuperForm2Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/superForm2/checklist");
  }, []);

  return null;
}
