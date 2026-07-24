import api from "@/services/apiClient";
import { Branch } from "@/types/storeHub";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const useBranches = () => {
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState<Branch[]>([]);


    const hasLoadedOnce = useRef(false);

    const fetchBranches = async (silent = false) => {
        try {

            if (!silent && !hasLoadedOnce.current) {
                setLoading(true);
            }

            const res = await api.get("/business/list-branches");

            //console.log("Business Profile Response:", res);

            setBranches(res?.data?.results?.data || []);
            hasLoadedOnce.current = true;
        } catch (e) {
            console.error("Failed to load branches:", e);
        } finally {
            if (!hasLoadedOnce.current) {
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    /* ================= INITIAL LOAD ================= */
    useEffect(() => {
        fetchBranches(false);
    }, []);

    /* ================= REFETCH ON SCREEN FOCUS ================= */
    useFocusEffect(
        useCallback(() => {
            fetchBranches(true);
        }, [])
    );

    return {
        branches,
        loading,
        refetch: fetchBranches,
    };
};