"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export interface FilterState {
  tab: "all" | "providers" | "doctors";
  q: string;
  gov: string;
  type: string;
  specialty: string;
  page: number;
}

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentFilters: FilterState = {
    tab: (searchParams.get("tab") as FilterState["tab"]) || "all",
    q: searchParams.get("q") || "",
    gov: searchParams.get("gov") || "",
    type: searchParams.get("type") || "",
    specialty: searchParams.get("specialty") || "",
    page: parseInt(searchParams.get("page") || "1", 10) || 1,
  };

  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || (key === "tab" && value === "all")) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      if (resetPage && !("page" in newFilters)) {
        params.delete("page");
      }

      startTransition(() => {
        const queryStr = params.toString();
        router.push(`${pathname}${queryStr ? `?${queryStr}` : ""}`, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const activeFiltersCount = [
    currentFilters.q ? 1 : 0,
    currentFilters.gov ? 1 : 0,
    currentFilters.type ? 1 : 0,
    currentFilters.specialty ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return {
    filters: currentFilters,
    updateFilters,
    resetFilters,
    isPending,
    activeFiltersCount,
  };
}
