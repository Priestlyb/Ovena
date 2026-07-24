import { useCallback, useEffect, useRef, useState } from "react";

import { getBranches } from "@/services/menu.service";
import { Branch } from "@/types/menu";

export const useBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");

    const [loading, setLoading] = useState(true);

    const hasLoadedBranchesRef = useRef(false);

    const fetchBranches = useCallback(async () => {
        try {
            if (!hasLoadedBranchesRef.current) {
                setLoading(true);
            }

            const res = await getBranches();
            const data = res.data;

            const raw = Array.isArray(data?.results?.data)
                ? data.results.data
                : Array.isArray(data?.results)
                    ? data.results
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data)
                            ? data
                            : [];

            const mapped: Branch[] = raw.map((branch: any) => ({
                id: String(branch.id),
                name: branch.name ?? "Unnamed Branch",
            }));

            setBranches(mapped);

            setSelectedBranch(
                (prev) => prev || mapped[0]?.id || ""
            );

            hasLoadedBranchesRef.current = true;
        } catch (error) {
            console.error(
                "Failed to fetch branches",
                error
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    return {
        branches,
        selectedBranch,
        setSelectedBranch,

        loading,

        fetchBranches,
    };
};