import { Badge } from "@/components/ui/badge";
import { Clock3 } from "lucide-react";

type AppHeaderProps = {
title: string;
description: string;
};

export function AppHeader({
title,
description,
}: AppHeaderProps) {
return ( 
<header className="flex flex-wrap items-center justify-between gap-4"> 
  <div> <h1 className="text-2xl font-bold tracking-tight text-[#14532D]">
{title} </h1>
    <p className="mt-1 text-sm text-slate-600">
      {description}
    </p>
  </div>

  <div className="flex items-center gap-3">
    <Badge
      variant="outline"
      className="border-[#DCFCE7] bg-white px-3 py-2 text-[#14532D]"
    >
      Counter 01
    </Badge>

    <div className="flex items-center gap-2 rounded-lg border border-[#DCFCE7] bg-white px-3 py-2 text-sm text-slate-600">
      <Clock3 size={16} className="text-[#16A34A]" />
      <span>Billing Counter</span>
    </div>
  </div>
</header>


);
}
