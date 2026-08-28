"use client";

import React, { useState } from "react";
import { DoctorWithGovernorate } from "@/lib/supabase/types";
import { DoctorCard } from "./doctor-card";
import { DoctorModal } from "./doctor-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

interface DoctorListProps {
  doctors: DoctorWithGovernorate[];
  isLoading?: boolean;
  searchQuery?: string;
  onResetFilters?: () => void;
}

export function DoctorList({
  doctors,
  isLoading = false,
  searchQuery = "",
  onResetFilters,
}: DoctorListProps) {
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorWithGovernorate | null>(null);

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

  if (doctors.length === 0) {
    return <EmptyState query={searchQuery} onReset={onResetFilters} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={(doc) => setSelectedDoctor(doc)}
          />
        ))}
      </div>

      <DoctorModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
      />
    </>
  );
}
