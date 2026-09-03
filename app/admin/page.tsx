"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminNavTabs, AdminTab } from "@/components/admin/admin-nav-tabs";
import { OverviewTab } from "@/components/admin/overview-tab";
import { DoctorsTab } from "@/components/admin/doctors-tab";
import { ProvidersTab } from "@/components/admin/providers-tab";
import { GovernoratesTab } from "@/components/admin/governorates-tab";
import { DoctorModal } from "@/components/admin/doctor-modal";
import { ProviderModal } from "@/components/admin/provider-modal";
import { DeleteConfirmModal } from "@/components/admin/delete-confirm-modal";
import { ToastBanner, ToastMessage } from "@/components/admin/toast-banner";
import { AdminUser } from "@/lib/admin-auth";
import { Governorate, DoctorWithGovernorate, ProviderWithGovernorate } from "@/lib/supabase/types";

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [providerInitialType, setProviderInitialType] = useState<string>("");

  // Global Data
  const [stats, setStats] = useState<any | null>(null);
  const [governorates, setGovernorates] = useState<any[]>([]);

  // Modals state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorWithGovernorate | null>(null);

  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderWithGovernorate | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{
    id: number;
    type: "doctor" | "provider";
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: "success" | "error" | "info", message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Check current session
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // 2. Fetch stats and governorates
  const fetchDashboardData = async () => {
    try {
      const [statsRes, govsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/governorates"),
      ]);

      const statsData = await statsRes.json();
      const govsData = await govsRes.json();

      if (statsRes.ok && statsData.success) {
        setStats(statsData.stats);
      }
      if (govsRes.ok && govsData.success) {
        setGovernorates(govsData.data || []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      setUser(null);
      addToast("info", "تم تسجيل الخروج بنجاح");
    } catch (err) {
      setUser(null);
    }
  };

  // Doctor Actions
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: DoctorWithGovernorate) => {
    setEditingDoctor(doc);
    setDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (formData: any): Promise<boolean> => {
    try {
      const isEditing = !!formData.id;
      const res = await fetch("/api/admin/doctors", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast("success", isEditing ? "تم حفظ تعديلات بيانات الطبيب بنجاح" : "تمت إضافة الطبيب بنجاح إلى قاعدة البيانات");
        setRefreshTrigger((prev) => prev + 1);
        fetchDashboardData();
        return true;
      } else {
        addToast("error", data.error || "تعذر حفظ بيانات الطبيب");
        return false;
      }
    } catch (err: any) {
      addToast("error", "حدث خطأ في الاتصال بالخادم");
      return false;
    }
  };

  const handlePromptDeleteDoctor = (doc: DoctorWithGovernorate) => {
    setDeletingItem({
      id: doc.id,
      type: "doctor",
      name: doc.doctor_name_ar,
    });
    setDeleteModalOpen(true);
  };

  // Provider Actions
  const handleOpenAddProvider = () => {
    setEditingProvider(null);
    setProviderModalOpen(true);
  };

  const handleOpenEditProvider = (prov: ProviderWithGovernorate) => {
    setEditingProvider(prov);
    setProviderModalOpen(true);
  };

  const handleSaveProvider = async (formData: any): Promise<boolean> => {
    try {
      const isEditing = !!formData.id;
      const res = await fetch("/api/admin/providers", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast("success", isEditing ? "تم حفظ تعديلات المنشأة بنجاح" : "تمت إضافة المنشأة الطبية بنجاح إلى قاعدة البيانات");
        setRefreshTrigger((prev) => prev + 1);
        fetchDashboardData();
        return true;
      } else {
        addToast("error", data.error || "تعذر حفظ بيانات المنشأة");
        return false;
      }
    } catch (err: any) {
      addToast("error", "حدث خطأ في الاتصال بالخادم");
      return false;
    }
  };

  const handlePromptDeleteProvider = (prov: ProviderWithGovernorate) => {
    setDeletingItem({
      id: prov.id,
      type: "provider",
      name: prov.name_ar,
    });
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      const endpoint = deletingItem.type === "doctor" ? "/api/admin/doctors" : "/api/admin/providers";
      const res = await fetch(`${endpoint}?id=${deletingItem.id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast(
          "success",
          deletingItem.type === "doctor"
            ? `تم حذف الطبيب (${deletingItem.name}) بنجاح`
            : `تم حذف المنشأة (${deletingItem.name}) بنجاح`
        );
        setDeleteModalOpen(false);
        setDeletingItem(null);
        setRefreshTrigger((prev) => prev + 1);
        fetchDashboardData();
      } else {
        addToast("error", data.error || "فشل في عملية الحذف");
      }
    } catch (err) {
      addToast("error", "تعذر الاتصال بالخادم لإتمام الحذف");
    } finally {
      setIsDeleting(false);
    }
  };

  // Auth Loading Skeleton
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4 text-slate-300">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-base font-bold">جاري التحقق من صلاحيات الدخول...</p>
        </div>
      </div>
    );
  }

  // If Not Authenticated, show friendly login view
  if (!user) {
    return (
      <>
        <ToastBanner toasts={toasts} onDismiss={dismissToast} />
        <AdminLogin
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            addToast("success", `مرحباً بك، ${loggedInUser.displayName}`, "تم تسجيل الدخول بنجاح");
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between pb-20 md:pb-8">
      {/* Toast Banner */}
      <ToastBanner toasts={toasts} onDismiss={dismissToast} />

      {/* Top Header */}
      <AdminHeader user={user} onLogout={handleLogout} />

      {/* Main Admin Area */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">
        {/* Navigation Tabs */}
        <AdminNavTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          doctorsCount={stats?.totalDoctors}
          providersCount={stats?.totalProviders}
          govsCount={governorates.length}
        />

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            onNavigateTab={(tab) => {
              if (tab === "providers") setProviderInitialType("");
              setActiveTab(tab);
            }}
            onNavigateToProvidersWithType={(type) => {
              setProviderInitialType(type);
              setActiveTab("providers");
            }}
            onAddNewDoctor={handleOpenAddDoctor}
            onAddNewProvider={handleOpenAddProvider}
          />
        )}

        {/* Tab 2: Doctors Management */}
        {activeTab === "doctors" && (
          <DoctorsTab
            governorates={governorates}
            refreshTrigger={refreshTrigger}
            onAddNew={handleOpenAddDoctor}
            onEdit={handleOpenEditDoctor}
            onDelete={handlePromptDeleteDoctor}
            toastSuccess={(msg) => addToast("success", msg)}
            toastError={(msg) => addToast("error", msg)}
          />
        )}

        {/* Tab 3: Providers Management */}
        {activeTab === "providers" && (
          <ProvidersTab
            governorates={governorates}
            refreshTrigger={refreshTrigger}
            initialType={providerInitialType}
            onAddNew={handleOpenAddProvider}
            onEdit={handleOpenEditProvider}
            onDelete={handlePromptDeleteProvider}
            toastSuccess={(msg) => addToast("success", msg)}
            toastError={(msg) => addToast("error", msg)}
          />
        )}

        {/* Tab 4: Governorates Management */}
        {activeTab === "governorates" && (
          <GovernoratesTab
            governorates={governorates}
            onRefresh={fetchDashboardData}
            toastSuccess={(msg) => addToast("success", msg)}
            toastError={(msg) => addToast("error", msg)}
          />
        )}
      </main>

      {/* Doctor Modal */}
      <DoctorModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        onSave={handleSaveDoctor}
        initialData={editingDoctor}
        governorates={governorates}
      />

      {/* Provider Modal */}
      <ProviderModal
        isOpen={providerModalOpen}
        onClose={() => setProviderModalOpen(false)}
        onSave={handleSaveProvider}
        initialData={editingProvider}
        governorates={governorates}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deletingItem?.type === "doctor" ? "تأكيد حذف الطبيب" : "تأكيد حذف المنشأة الطبية"}
        itemName={deletingItem?.name || ""}
        itemTypeLabel={deletingItem?.type === "doctor" ? "طبيب" : "منشأة طبية"}
        isLoading={isDeleting}
      />
    </div>
  );
}
