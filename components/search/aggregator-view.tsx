"use client";

import React, { useTransition, useState, useEffect } from "react";
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
import { Building2, User, Layers, Sparkles, Filter, HeartHandshake, BookOpen, ChevronLeft } from "lucide-react";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Sync / fetch data when filters change
  useEffect(() => {
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

        const res = await fetch(`/api/search?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Search failed");
        const json = await res.json();

        if (isMounted) {
          setProviders(json.providers || []);
          setProvidersCount(json.providersCount || 0);
          setDoctors(json.doctors || []);
          setDoctorsCount(json.doctorsCount || 0);
        }
      } catch (err) {
        console.error("Error fetching filtered data", err);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
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

  return (
    <div className="min-h-screen pb-20 md:pb-12">
      {/* Hero Search Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background pt-6 pb-8 border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-bold gap-1.5 rounded-full bg-primary/10 text-primary border-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>دليل شبكة مقدمي الخدمات الطبية بالمحافظات 2026</span>
              </Badge>

              <Link
                href="/introduction"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800 hover:scale-105 transition-all shadow-sm"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>إشراف وإهداء: أ/ تامر صبحي عبدالله</span>
                <ChevronLeft className="w-3 h-3" />
              </Link>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              ابحث عن أقرب مستشفى، معمل، أو طبيب معتمد
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              دليل متكامل يضم {initialProvidersCount} منشأة طبية و {initialDoctorsCount} طبيب واستشاري
              موزعين عبر {initialGovernorates.length} محافظة لخدمة العاملين بمصلحتي الجمارك والضرائب.
            </p>

            {/* Quick Link to Bylaws */}
            <div className="pt-1">
              <Link
                href="/bylaws"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>اطّلع على لائحة الاشتراكات ونسب المساهمة والحدود القصوى للعلاج 2026</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Search Bar + Mobile Filter Trigger */}
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <SearchBar
              initialValue={filters.q}
              onSearch={(val) => updateFilters({ q: val })}
              isSearching={isLoading}
            />

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

          {/* Quick Filter Facility Chips Banner */}
          {filters.tab !== "doctors" && (
            <div className="max-w-5xl mx-auto mt-4">
              <StatsBanner
                selectedType={filters.type}
                onSelectType={(t) => updateFilters({ type: t })}
                typeCounts={initialTypeCounts}
              />
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols on lg) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20 p-5 rounded-2xl border bg-card/60 shadow-sm">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
              {/* Category Tabs */}
              <Tabs
                value={filters.tab}
                onValueChange={(val) =>
                  updateFilters({ tab: val as FilterState["tab"] })
                }
                className="w-full sm:w-auto"
              >
                <TabsList className="w-full sm:w-auto bg-muted/70">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    <Layers className="w-4 h-4 ml-1.5" />
                    <span>الكل ({initialProvidersCount + initialDoctorsCount})</span>
                  </TabsTrigger>

                  <TabsTrigger value="providers" className="text-xs sm:text-sm">
                    <Building2 className="w-4 h-4 ml-1.5 text-primary" />
                    <span>المنشآت ({initialProvidersCount})</span>
                  </TabsTrigger>

                  <TabsTrigger value="doctors" className="text-xs sm:text-sm">
                    <User className="w-4 h-4 ml-1.5 text-indigo-600 dark:text-indigo-400" />
                    <span>الأطباء ({initialDoctorsCount})</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Result Count Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground self-end sm:self-center">
                <span>النتائج المعروضة:</span>
                <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5">
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
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span>المنشآت الطبية والمستشفيات</span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {providersCount}
                          </Badge>
                        </h2>
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
                    <section className="space-y-3 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span>الأطباء والعيادات التخصصية</span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {doctorsCount}
                          </Badge>
                        </h2>
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
              <PaginationControls
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={currentTotalForPagination}
                pageSize={pageSize}
                onPageChange={(p) => updateFilters({ page: p }, false)}
                isPending={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={filters.tab}
        onTabChange={(tab) => updateFilters({ tab })}
        onOpenFilter={() => {
          // Open mobile filter sheet
          const trigger = document.querySelector('[data-state="closed"]') as HTMLElement;
          trigger?.click();
        }}
        activeFilterCount={activeFiltersCount}
      />
    </div>
  );
}
