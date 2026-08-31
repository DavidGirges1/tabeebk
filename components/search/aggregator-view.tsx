"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useFilters, FilterState } from "@/lib/hooks/use-filters";
import { Governorate, ProviderWithGovernorate, DoctorWithGovernorate } from "@/lib/supabase/types";
import { SearchBar } from "@/components/search/search-bar";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { FilterDrawer } from "@/components/search/filter-drawer";
import { ActiveFilterPills } from "@/components/search/active-filter-pills";
import { StatsBanner } from "@/components/layout/stats-banner";
import { ProviderList } from "@/components/providers/provider-list";
import { DoctorList } from "@/components/doctors/doctor-list";
import { PaginationControls } from "@/components/search/pagination-controls";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Layers,
  Sparkles,
  HeartHandshake,
  BookOpen,
  ChevronLeft,
  Search,
} from "lucide-react";

interface AggregatorViewProps {
  initialGovernorates: Governorate[];
  initialProviders: ProviderWithGovernorate[];
  initialProvidersCount: number;
  initialDoctors: DoctorWithGovernorate[];
  initialDoctorsCount: number;
  initialGovernorateCounts: Record<number, number>;
  initialTypeCounts: Record<string, number>;
  initialSpecialties: string[];
}

export function AggregatorView({
  initialGovernorates,
  initialProviders,
  initialProvidersCount,
  initialDoctors,
  initialDoctorsCount,
  initialGovernorateCounts,
  initialTypeCounts,
  initialSpecialties,
}: AggregatorViewProps) {
  const { filters, updateFilters, resetFilters, activeFiltersCount, isPending: isRouterPending } =
    useFilters();

  const [providers, setProviders] = useState<ProviderWithGovernorate[]>(initialProviders);
  const [providersCount, setProvidersCount] = useState<number>(initialProvidersCount);
  const [doctors, setDoctors] = useState<DoctorWithGovernorate[]>(initialDoctors);
  const [doctorsCount, setDoctorsCount] = useState<number>(initialDoctorsCount);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Sync / fetch data with AbortController to prevent race conditions and fast typing crashes
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      setIsFetching(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.tab) queryParams.set("tab", filters.tab);
        if (filters.q) queryParams.set("q", filters.q);
        if (filters.gov) queryParams.set("gov", filters.gov);
        if (filters.type) queryParams.set("type", filters.type);
        if (filters.specialty) queryParams.set("specialty", filters.specialty);
        if (filters.page) queryParams.set("page", String(filters.page));
        queryParams.set("pageSize", "12");

        const res = await fetch(`/api/search?${queryParams.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Search request failed");
        }

        const json = await res.json();

        if (isMounted) {
          setProviders(json.providers || []);
          setProvidersCount(json.providersCount || 0);
          setDoctors(json.doctors || []);
          setDoctorsCount(json.doctorsCount || 0);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return; // Expected when user types fast
        }
        console.error("Error fetching filtered data:", err);
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filters.tab, filters.q, filters.gov, filters.type, filters.specialty, filters.page]);

  const isLoading = isFetching || isRouterPending;

  // Active counts calculation
  const totalActiveItems =
    filters.tab === "providers"
      ? providersCount
      : filters.tab === "doctors"
      ? doctorsCount
      : providersCount + doctorsCount;

  const pageSize = 12;
  const currentTotalForPagination =
    filters.tab === "doctors" ? doctorsCount : providersCount;
  const totalPages = Math.ceil((currentTotalForPagination || 1) / pageSize);

  const handleSearchChange = useCallback(
    (val: string) => {
      updateFilters({ q: val });
    },
    [updateFilters]
  );

  return (
    <div className="min-h-screen pb-20 md:pb-12 bg-background">
      {/* Refined & Decluttered Hero Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background pt-8 pb-10 border-b border-border/40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Top Quick Links & Announcements */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <Badge
              variant="outline"
              className="px-3.5 py-1 text-xs font-semibold gap-1.5 rounded-full bg-primary/10 text-primary border-primary/20 shadow-none"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>دليل شبكة التعاقدات الطبية 2026</span>
            </Badge>

            <Link
              href="/introduction"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>إشراف وإهداء: أ/ تامر صبحي</span>
              <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            </Link>

            <Link
              href="/bylaws"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>لائحة الاشتراكات والحدود القصوى 2026</span>
              <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>

          {/* Hero Heading */}
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-7">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight sm:leading-tight">
              ابحث في شبكة الرعاية الطبية
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              دليل معتمد يضم أكثر من {initialProvidersCount + initialDoctorsCount} مستشفى، معمل، وعيادة تخصصية لخدمة العاملين بمصلحتي الجمارك والضرائب.
            </p>
          </div>

          {/* Search Bar + Mobile Filter Trigger */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SearchBar
                  initialValue={filters.q}
                  onSearch={handleSearchChange}
                  isSearching={isLoading}
                />
              </div>

              {/* Mobile Filter Sheet Trigger */}
              <div className="lg:hidden">
                <FilterDrawer
                  filters={filters}
                  governorates={initialGovernorates}
                  specialties={initialSpecialties}
                  governorateCounts={initialGovernorateCounts}
                  typeCounts={initialTypeCounts}
                  onFilterChange={updateFilters}
                  onReset={resetFilters}
                  activeCount={activeFiltersCount}
                />
              </div>
            </div>

            {/* Quick Facility Category Pills */}
            {filters.tab !== "doctors" && (
              <div className="pt-1">
                <StatsBanner
                  selectedType={filters.type}
                  onSelectType={(t) => updateFilters({ type: t })}
                  typeCounts={initialTypeCounts}
                />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 cols on lg) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-22 p-5 rounded-2xl border bg-card/80 backdrop-blur shadow-sm">
            <FilterSidebar
              filters={filters}
              governorates={initialGovernorates}
              specialties={initialSpecialties}
              governorateCounts={initialGovernorateCounts}
              typeCounts={initialTypeCounts}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />
          </div>

          {/* Content Section (9 cols on lg) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Tabs & Result Counters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
              
              {/* Category Tabs */}
              <Tabs
                value={filters.tab}
                onValueChange={(val) =>
                  updateFilters({ tab: val as FilterState["tab"] })
                }
                className="w-full sm:w-auto"
              >
                <TabsList className="w-full sm:w-auto bg-muted/60 p-1 rounded-xl h-11">
                  <TabsTrigger value="all" className="rounded-lg text-xs sm:text-sm font-semibold">
                    <Layers className="w-4 h-4 ml-1.5" />
                    <span>الكل ({initialProvidersCount + initialDoctorsCount})</span>
                  </TabsTrigger>

                  <TabsTrigger value="providers" className="rounded-lg text-xs sm:text-sm font-semibold">
                    <Building2 className="w-4 h-4 ml-1.5 text-primary" />
                    <span>المنشآت ({initialProvidersCount})</span>
                  </TabsTrigger>

                  <TabsTrigger value="doctors" className="rounded-lg text-xs sm:text-sm font-semibold">
                    <User className="w-4 h-4 ml-1.5 text-indigo-600 dark:text-indigo-400" />
                    <span>الأطباء ({initialDoctorsCount})</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Result Count Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground self-end sm:self-center">
                <span>النتائج المعروضة:</span>
                <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {totalActiveItems} نتيجة
                </Badge>
              </div>
            </div>

            {/* Active Filter Badges with 1-click removal */}
            <ActiveFilterPills
              filters={filters}
              governorates={initialGovernorates}
              onRemove={(key) => updateFilters({ [key]: "" })}
              onReset={resetFilters}
            />

            {/* Results Grid View */}
            <div className="space-y-8">
              {/* If 'All' mode is active, render facilities first then doctors */}
              {filters.tab === "all" ? (
                <>
                  {providers.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between pb-1 border-b border-border/50">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span>المنشآت الطبية والمستشفيات</span>
                        </h2>
                        <Badge variant="outline" className="text-xs font-mono font-bold">
                          {providersCount} منشأة
                        </Badge>
                      </div>

                      <ProviderList
                        providers={providers}
                        isLoading={isLoading}
                        searchQuery={filters.q}
                        onResetFilters={resetFilters}
                      />
                    </section>
                  )}

                  {doctors.length > 0 && (
                    <section className="space-y-4 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-border/50">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span>الأطباء والعيادات التخصصية</span>
                        </h2>
                        <Badge variant="outline" className="text-xs font-mono font-bold">
                          {doctorsCount} طبيب
                        </Badge>
                      </div>

                      <DoctorList
                        doctors={doctors}
                        isLoading={isLoading}
                        searchQuery={filters.q}
                        onResetFilters={resetFilters}
                      />
                    </section>
                  )}

                  {providers.length === 0 && doctors.length === 0 && (
                    <ProviderList
                      providers={[]}
                      isLoading={isLoading}
                      searchQuery={filters.q}
                      onResetFilters={resetFilters}
                    />
                  )}
                </>
              ) : filters.tab === "providers" ? (
                <ProviderList
                  providers={providers}
                  isLoading={isLoading}
                  searchQuery={filters.q}
                  onResetFilters={resetFilters}
                />
              ) : (
                <DoctorList
                  doctors={doctors}
                  isLoading={isLoading}
                  searchQuery={filters.q}
                  onResetFilters={resetFilters}
                />
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-4">
                <PaginationControls
                  currentPage={filters.page}
                  totalPages={totalPages}
                  totalItems={currentTotalForPagination}
                  pageSize={pageSize}
                  onPageChange={(p) => updateFilters({ page: p }, false)}
                  isPending={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={filters.tab}
        onTabChange={(tab) => updateFilters({ tab })}
        onOpenFilter={() => {
          const trigger = document.querySelector('[data-state="closed"]') as HTMLElement;
          trigger?.click();
        }}
        activeFilterCount={activeFiltersCount}
      />
    </div>
  );
}

