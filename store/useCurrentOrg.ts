import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Organization {
    name: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    id: string;
}

const useCurrentOrg = create(
    persist<{
        currentOrg: Organization | null;
        setCurrentOrg: (org: Organization) => void;
    }>(
        (set) => ({
            currentOrg: null,
            setCurrentOrg: (org) => set(() => ({ currentOrg: org })),
        }),
        { name: "currentOrg" }
    )
);

export default useCurrentOrg;