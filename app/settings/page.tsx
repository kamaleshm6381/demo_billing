import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-2 rounded-xl bg-[#14532D] p-5 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl flex items-center gap-2">
          <Settings size={22} />
          System Settings
        </h1>
        <p className="text-xs text-green-200">
          Configure application preferences and tax details
        </p>
      </div>

      <Card className="border-[#DCFCE7] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-[#14532D] flex items-center gap-2">
            <Sliders size={18} />
            General Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-gray-600">
          <div className="rounded-lg border p-4 bg-gray-50/50 space-y-2">
            <p className="font-semibold text-gray-900">Hotel Local Billing Configuration</p>
            <p>Currency: Indian Rupee (₹)</p>
            <p>Storage Mode: Local Browser Storage (localStorage)</p>
            <p>Version: 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
