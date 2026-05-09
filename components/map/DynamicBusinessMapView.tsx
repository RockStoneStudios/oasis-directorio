"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const DynamicBusinessMapView = dynamic(
  () => import("./BusinessMapView").then((mod) => mod.BusinessMapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[480px] w-full items-center justify-center rounded-2xl bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
    ),
  },
);
