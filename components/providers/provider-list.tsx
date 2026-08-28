"use client";

import React, { useState } from "react";
import { ProviderWithGovernorate } from "@/lib/supabase/types";
import { ProviderCard } from "./provider-card";
import { ProviderModal } from "./provider-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

interface ProviderListProps {
  providers: ProviderWithGovernorate[];
  isLoading?: boolean;
  searchQuery?: string;
  onResetFilters?: () => void;
}

export function ProviderList({
  providers,
  isLoading = false,
  searchQuery = "",
  onResetFilters,
}: ProviderListProps) {
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderWithGovernorate | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border bg-card space-y-3.5 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex justify-between pt-2 border-t">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return <EmptyState query={searchQuery} onReset={onResetFilters} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onSelect={(prov) => setSelectedProvider(prov)}
          />
        ))}
      </div>

      <ProviderModal
        provider={selectedProvider}
        isOpen={Boolean(selectedProvider)}
        onClose={() => setSelectedProvider(null)}
      />
    </>
  );
}
