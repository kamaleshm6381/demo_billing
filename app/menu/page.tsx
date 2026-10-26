import {MenuManagement } from "@/components/billing/menu-management";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-green-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <MenuManagement />
      </div>
    </main>
  );
}